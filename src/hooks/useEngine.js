import { useCallback, useRef, useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Command } from "@tauri-apps/plugin-shell";
import { DNS_MAP, DOH_MAP, RETRY_DELAYS, APP, DPI_TIMEOUTS } from '../constants';

function probeAndroidPlatform() {
  if (typeof navigator === 'undefined' || !navigator.userAgent) return false;
  return navigator.userAgent.includes('Android');
}

export function useEngine({ 
  configRef, 
  setConfig,
  addLog, 
  t, 
  setIsConnected, 
  setIsProcessing, 
  updateConfig, 
  notifyUser, 
  updateTrayTooltip,
  saveSession,
  connectedAt,
  setConnectedAt,
  pingMs,
  currentPortRef,
  setCurrentPort,
  setPacPort,
  setLanIp,
  buildDivertConfig,
  clearProxy,
  resolveI18nMessage
}) {
  const childProcess = useRef(null);
  const isStartingEngine = useRef(false);
  const retryCount = useRef(0);
  const retryTimer = useRef(null);
  const userIntentDisconnect = useRef(false);
  const fatalErrorRef = useRef(false);
  const isRetrying = useRef(false);
  const [vpnActive, setVpnActive] = useState(false);
  const vpnPollRef = useRef(null);
  const androidPlatform = probeAndroidPlatform();

  useEffect(() => {
    if (vpnActive) {
      const poll = setInterval(async () => {
        try {
          const status = await invoke('vpn_status');
          if (status && !status.running) {
            vpnStopped();
          }
        } catch (e) {
          console.warn('vpn_status poll error:', e);
        }
      }, 2000);
      vpnPollRef.current = poll;
    } else {
      if (vpnPollRef.current) {
        clearInterval(vpnPollRef.current);
        vpnPollRef.current = null;
      }
    }
    return () => {
      if (vpnPollRef.current) clearInterval(vpnPollRef.current);
    };
  }, [vpnActive]);

  const vpnStopped = () => {
    setVpnActive(false);
    setIsConnected(false);
    setConnectedAt(null);
    updateTrayTooltip('disconnected');
    notifyUser('DocsPI', t?.logDisconnected || 'VPN disconnected', 'disconnect');
    if (addLog) addLog(t?.logDisconnected || 'VPN disconnected', 'warn');
  };

  const startAndroidVpn = useCallback(async () => {
    updateTrayTooltip('connecting');
    if (addLog) addLog(t?.logStartingVpn || 'Starting VPN...', 'info');
    try {
      await invoke('start_vpn', {
        config: {
          dns: configRef.current.selectedDns || '1.1.1.1',
          proxy_port: 0,
          bypass_mode: configRef.current.networkMode || 'game',
          fake_sni: configRef.current.fakeSni || 'www.google.com',
          dpi_method: configRef.current.dpiMethod || '2',
        }
      });
      setVpnActive(true);
      retryCount.current = 0;
      setIsConnected(true);
      setConnectedAt(Date.now());
      setIsProcessing(false);
      updateTrayTooltip('connected');
      notifyUser('DocsPI', t?.logVpnConnected || 'VPN connection active', 'connect');
      if (addLog) addLog(t?.logVpnConnected || 'VPN started successfully', 'success');
    } catch (e) {
      setVpnActive(false);
      setIsConnected(false);
      setIsProcessing(false);
      updateTrayTooltip('disconnected');
      if (addLog) addLog(t?.logVpnStartError?.(e) || `VPN start failed: ${e}`, 'error');
    }
  }, [addLog, configRef, notifyUser, setConnectedAt, setIsConnected, setIsProcessing, t, updateTrayTooltip]);

  const stopAndroidVpn = useCallback(async () => {
    try {
      await invoke('stop_vpn');
    } catch (e) {
      console.warn('stop_vpn error:', e);
    }
    vpnStopped();
  }, [vpnStopped]);

  const getRetryDelay = (attempt) => {
    return RETRY_DELAYS[Math.min(attempt, RETRY_DELAYS.length - 1)];
  };

  const waitForPort = async (port, maxAttempts = APP.portCheckMaxAttempts) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const open = await invoke("check_port_open", { port });
        if (open) return true;
      } catch (e) {
        console.warn("Port check error:", e);
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    return false;
  };

  const startGameModeEngine = useCallback(async () => {
    updateTrayTooltip("connecting");
    fatalErrorRef.current = false;

    const adminOk = await invoke('check_admin').catch(() => false);
    if (!adminOk) {
      addLog('Oyun Modu için yönetici (Admin) yetkisi gereklidir. Uygulamayı sağ tık → Yönetici olarak çalıştır ile açın.', 'error');
      setIsProcessing(false);
      isStartingEngine.current = false;
      updateTrayTooltip("disconnected");
      return;
    }

    addLog('Oyun Modu başlatılıyor...', 'info');

    try {
      const divertConfig = buildDivertConfig('game', 0);
      await invoke('start_divert_engine', { config: divertConfig });
    } catch (e) {
      addLog(`Oyun Modu başlatılamadı: ${e}`, 'error');
      setIsProcessing(false);
      isStartingEngine.current = false;
      return;
    }

    let running = false;
    for (let i = 0; i < 8; i++) {
      await new Promise((r) => setTimeout(r, 500));
      running = await invoke('check_divert_running').catch(() => false);
      if (running) break;
    }

    if (!running) {
      const divertLog = await invoke('get_divert_log').catch(() => '');
      if (divertLog.trim()) {
        divertLog.trim().split('\n').forEach(line => addLog(line, 'error'));
      } else {
        addLog('Oyun Modu başlatılamadı. Yönetici olarak çalıştırın.', 'error');
      }
      setIsProcessing(false);
      isStartingEngine.current = false;
      return;
    }

    retryCount.current = 0;
    userIntentDisconnect.current = false;
    setIsConnected(true);
    setIsProcessing(false);
    addLog('Oyun Modu aktif — Roblox ve UDP oyunlar hazır.', 'success');
    notifyUser("DocsPI", "Oyun Modu aktif", "connect");
    updateTrayTooltip("connected");
    isStartingEngine.current = false;
  }, [addLog, buildDivertConfig, notifyUser, setIsConnected, setIsProcessing, updateTrayTooltip]);

  const attemptReconnect = useCallback(() => {
    if (retryTimer.current) {
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
    }

    const currentAttempt = retryCount.current;
    const maxAttempts = APP.maxReconnectAttempts;

    if (currentAttempt >= maxAttempts) {
      const currentMode = configRef.current.dpiMethod;
      const MODE_ESCALATION = { '0': '1', '1': '2', '2': null };
      const nextMode = MODE_ESCALATION[currentMode];

      if (configRef.current.autoEscalate && nextMode) {
        const modeNames = { '0': 'Turbo', '1': 'Dengeli', '2': 'Güçlü' };
        addLog(t.logAutoEscalate(modeNames[nextMode]) || `Bağlantı kurulamadı, ${modeNames[nextMode]} moda geçiliyor...`, 'warn', {
          i18nKey: 'logAutoEscalate',
          i18nParams: [modeNames[nextMode]],
        });
        updateConfig('dpiMethod', nextMode);
        retryCount.current = 0;
        setTimeout(() => startEngine(8080), 1000);
        return;
      }

      addLog(`=4 ${t.logMaxRetries}`, "error", { i18nKey: "logMaxRetries" });
      addLog("", "info");
      addLog(`=4 ${t.logPossibleReasons}`, "warn", {
        i18nKey: "logPossibleReasons",
      });
      addLog(`  • ${t.logReasonInternet}`, "info", {
        i18nKey: "logReasonInternet",
      });
      addLog(`  • ${t.logReasonFirewall}`, "info", {
        i18nKey: "logReasonFirewall",
      });
      addLog(`  • ${t.logReasonPorts}`, "info", { i18nKey: "logReasonPorts" });
      addLog("", "info");
      addLog(`=4 ${t.logSolutions}`, "warn", { i18nKey: "logSolutions" });
      addLog(`  • ${t.logSolInternet}`, "info", { i18nKey: "logSolInternet" });
      addLog(`  • ${t.logSolFirewall}`, "info", { i18nKey: "logSolFirewall" });
      addLog(`  • ${t.logSolAdmin}`, "info", { i18nKey: "logSolAdmin" });
      addLog(`  • ${t.logSolLogs}`, "info", { i18nKey: "logSolLogs" });

      retryCount.current = 0;
      setIsProcessing(false);

      if (connectedAt) {
        const duration = Math.floor((Date.now() - connectedAt) / 1000);
        saveSession({
          duration,
          mode: configRef.current.dpiMethod,
          networkMode: configRef.current.networkMode,
          avgPing: pingMs,
          disconnectReason: 'failure'
        });
        setConnectedAt(null);
      }
      return;
    }

    const delay = getRetryDelay(currentAttempt);
    retryCount.current++;

    if (delay === 0) {
      addLog(t.logReconnecting(currentAttempt + 1), "warn", {
        i18nKey: "logReconnecting",
        i18nParams: [currentAttempt + 1],
      });
      startEngine(8080);
    } else {
      addLog(
        t.logReconnectWait(delay / 1000, currentAttempt + 1),
        "warn",
        {
          i18nKey: "logReconnectWait",
          i18nParams: [delay / 1000, currentAttempt + 1],
        },
      );
      updateTrayTooltip("retrying");
      retryTimer.current = setTimeout(() => {
        addLog(t.logReconnectNow, "info", {
          i18nKey: "logReconnectNow",
        });
        startEngine(8080);
      }, delay);
    }
  }, [addLog, configRef, connectedAt, pingMs, saveSession, setConnectedAt, setIsProcessing, t, updateConfig, updateTrayTooltip]);

  const startEngine = useCallback(async (ignoredPort, portRetryCount = 0) => {
    if (isStartingEngine.current || childProcess.current) return;
    isStartingEngine.current = true;

    if (androidPlatform) {
      await startAndroidVpn();
      return;
    }

    if (configRef.current.networkMode === 'game') {
      await startGameModeEngine();
      return;
    }

    updateTrayTooltip("connecting");
    fatalErrorRef.current = false;

    if (portRetryCount >= APP.maxPortRetries) {
      addLog(t.logNoPort, "error", { i18nKey: "logNoPort" });
      setIsProcessing(false);
      isStartingEngine.current = false;
      return;
    }

    let configData;
    let port;
    let bindAddr;

    try {
      const nm = configRef.current.networkMode || 'smooth';
      configData = await invoke("get_sidecar_config", {
        allowLanSharing: configRef.current.lanSharing || false,
        enableGameMode: nm === 'super' || nm === 'game',
      });
      port = configData.port;
      bindAddr = configData.bind_address;
      setLanIp(configData.lan_ip);
    } catch (e) {
      addLog(t.logConfigError(e), "error", {
        i18nKey: "logConfigError",
        i18nParams: [e],
      });
      setIsProcessing(false);
      isStartingEngine.current = false;
      return;
    }

    if (childProcess.current) {
        try {
          await childProcess.current.kill();
        } catch (e) { console.warn("child kill failed:", e); }
        childProcess.current = null;
    }
    await clearProxy(true);

    const currentDns = configRef.current.selectedDns;
    const dnsIP = DNS_MAP[currentDns];

    addLog(t.logEngineStarting(port), "info", {
      i18nKey: "logEngineStarting",
      i18nParams: [port],
    });

    let resolvedDns = currentDns;
    let resolvedDnsIp = dnsIP;
    const fallbackChain = configRef.current.fallbackDnsChain || [];
    
    if (dnsIP && fallbackChain.length > 0) {
      try {
        const primaryLatency = await invoke('check_dns_latency', { dnsIp });
        if (primaryLatency >= 999) throw new Error('unreachable');
      } catch (_) {
        addLog(t.logDnsPrimaryFail?.(currentDns.toUpperCase()) || `${currentDns.toUpperCase()} yanit vermiyor, yedek DNS deneniyor...`, 'warn');
        
        for (const fallbackId of fallbackChain) {
          if (fallbackId === currentDns) continue;
          const fallbackIp = DNS_MAP[fallbackId];
          if (!fallbackIp) continue;
          
          try {
            const latency = await invoke('check_dns_latency', { dnsIp: fallbackIp });
            if (latency < 999) {
              resolvedDns = fallbackId;
              resolvedDnsIp = fallbackIp;
              await updateConfig('selectedDns', fallbackId);
              addLog(t.logDnsFallback?.(fallbackId.toUpperCase(), latency) || `Yedek DNS: ${fallbackId.toUpperCase()} (${latency}ms)`, 'success');
              break;
            }
          } catch (e) { console.warn("fallback DNS check failed:", e); }
        }
        
        if (resolvedDns === currentDns) {
          addLog(t.logDnsAllFail || 'Tum yedek DNS sunuculari yanit vermiyor, sistem DNS kullanilacak.', 'warn');
          resolvedDns = 'system';
          resolvedDnsIp = null;
        }
      }
    }

    if (resolvedDnsIp) {
      addLog(t.logDnsUsed(resolvedDns.toUpperCase(), resolvedDnsIp), "info", {
        i18nKey: "logDnsUsed",
        i18nParams: [resolvedDns.toUpperCase(), resolvedDnsIp],
      });
    } else {
      addLog(t.logDnsDefault, "info", { i18nKey: "logDnsDefault" });
    }

    isRetrying.current = false;

    try {
      const TIMEOUT_MS = DPI_TIMEOUTS[configRef.current.dpiMethod] ?? 5000;
      const listenAddr = `${bindAddr}:${port}`;
      const args =[
        "--clean", 
        "--listen-addr", listenAddr,
        "--timeout", TIMEOUT_MS.toString(),
        "--silent",
        "--log-level", "info",
      ];

      if (configRef.current.ipv4Only !== false) {
        args.push("--dns-qtype", "ipv4");
      } else {
        args.push("--dns-qtype", "all");
      }

      if (currentDns === "system" || !dnsIP) {
        args.push("--dns-mode", "system");
      } else {
        const dohUrl = DOH_MAP[currentDns];
        if (dohUrl) {
          args.push("--dns-mode", "https", "--dns-https-url", dohUrl);
        } else {
          args.push("--dns-addr", `${dnsIP}:53`, "--dns-mode", "udp");
        }
      }

      const dpiMethod = configRef.current.dpiMethod || "1";
      const userChunk = [1, 2, 4, 8, 16].includes(Number(configRef.current.httpsChunkSize))
        ? String(configRef.current.httpsChunkSize)
        : "2";

      const hasDriver = await invoke('check_driver');
      
      if (dpiMethod === "2") {
        const advancedBypass = configRef.current.advancedBypass === true;
        const fakeSni = configRef.current.fakeSni || "www.google.com";
        if (hasDriver && advancedBypass) {
          args.push("--https-split-mode", "chunk", "--https-chunk-size", "1", "--https-fake-count", "3", "--https-fake-sni", fakeSni);
          addLog(t.logStrongFake || "Güçlü Mod: Fake Paket (3) aktif.", "success");
        } else {
          args.push("--https-split-mode", "chunk", "--https-chunk-size", "1");
          if (!hasDriver) {
            addLog(t.logStrongNoDriver || "Güçlü Mod: Sürücü yok, sadece Chunk-1 aktif.", "warn");
          } else {
            addLog(t.logStrongChunkOnly || "Güçlü Mod: Chunk-1 aktif.", "info");
          }
        }
      } else if (dpiMethod === "1") {
        args.push("--https-split-mode", "chunk", "--https-chunk-size", userChunk);
      } else {
        args.push("--https-split-mode", "sni");
      }

      const command = Command.sidecar("binaries/docspi-proxy", args);

      let connectionConfirmed = false;
      let isReady = false;

      const SKIP_PATTERN = new RegExp(
        "\\[(?:PROXY|DNS|HTTPS|CACHE|app)]|method:\\s*CONNECT|cache (?:miss|hit)|resolving|routing|resolution took|new conn|client sent hello|shouldExploit|useSystemDns|fragmentation|conn established|writing chunked|caching \\d+ records|[a-f0-9]{8}-[a-f0-9]{8}|d88|Y88|88P|level=|ctrl \\+ c|listen_addr|dns_addr|github\\.com|spoofdpi|connection timeout|\\[::1\\]|ipv6|AAAA|no suitable address|network is unreachable|connectex.*\\[|telemetry\\.net|dns lookup failed",
        "i",
      );

      const isTunnelShutdownNoise = (l) =>
        /\[pxy\].*error handling request|unsuccessful tunnel|wsarecv|aborted by the software in your host machine|failed to read http request|malformed HTTP request|invalid method/i.test(
          l,
        );

      const handleOutput = async (line, type) => {
        const trimmedLine = line.trim();
        const lowerLine = line.toLowerCase();

        if (trimmedLine.length === 0) return;
        if (/^(DBG|INF|WRN|ERR)\s+\d{4}-/.test(trimmedLine)) return;
        if (line.includes("888")) return;
        if (isTunnelShutdownNoise(line)) return;
        if (SKIP_PATTERN.test(line)) return;

        const alphaCount = line.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, "").length;
        if (alphaCount < 5 && trimmedLine.length > 3) return;

        let friendlyKey = null;
        let friendlyParams = [];

        const isWpcapError =
          lowerLine.includes("couldn't load wpcap.dll") ||
          lowerLine.includes("error starting network detector");

        if (isWpcapError) {
          fatalErrorRef.current = true;
          friendlyKey = "logWpcapMissing";
        }

        const isPortInUse =
          (lowerLine.includes("bind") || lowerLine.includes("yuva adresi")) &&
          (lowerLine.includes("already in use") ||
            lowerLine.includes("only one usage"));

        if (lowerLine.includes("fake sni:")) return;

        if (lowerLine.includes("listening on") || lowerLine.includes("created a listener")) {
          isReady = true;
          friendlyKey = "logSpoofReady";
          friendlyParams = [port];
        } else if (lowerLine.includes("server started")) {
          isReady = true;
          friendlyKey = "logEngineActive";
        } else if (isPortInUse) {
          friendlyKey = "logPortBusy";
          friendlyParams = [port];
        } else if (lowerLine.includes("initializing")) {
          friendlyKey = "logInitializing";
        }

        if (friendlyKey) {
          const msg = resolveI18nMessage(friendlyKey, friendlyParams);
          let logType = "info";
          if (friendlyKey === "logWpcapMissing") logType = "error";
          else if (friendlyKey === "logPortBusy") logType = "warn";
          else if (friendlyKey === "logSpoofReady" || friendlyKey === "logEngineActive") logType = "success";
          addLog(msg, logType, { i18nKey: friendlyKey, i18nParams: friendlyParams });
        } else {
          addLog(trimmedLine, type === "warn" ? "warn" : "info");
        }

        if (!connectionConfirmed && isReady) {
          connectionConfirmed = true;
          await new Promise((r) => setTimeout(r, 400));
          const portReady = await waitForPort(port);
          if (!portReady) {
            addLog(t.logPortRetryOpen(port), "warn", { i18nKey: "logPortRetryOpen", i18nParams: [port] });
            if (portRetryCount < 19) {
              isRetrying.current = true;
              if (childProcess.current) {
                childProcess.current.kill().catch(() => {});
                childProcess.current = null;
              }
              setTimeout(() => {
                isRetrying.current = false;
                startEngine(0, portRetryCount + 1);
              }, 2000);
            }
            return;
          }

          setCurrentPort(port);
          currentPortRef.current = port;
          try {
            await invoke("set_system_proxy", { port, enableWinhttp: true, customBypassDomains: configRef.current.customDomains || [] });
            addLog(t.logProxySet(port), "success", { i18nKey: "logProxySet", i18nParams: [port] });
          } catch (err) {
            addLog(t.logProxySetError(err), "error", { i18nKey: "logProxySetError", i18nParams: [err] });
            return;
          }

          if (configRef.current.networkMode === 'super') {
            try {
              const divertConfig = buildDivertConfig('super', port);
              await invoke('start_divert_engine', { config: divertConfig });
              addLog('Süper Mod: Divert engine başlatıldı (UDP + DNS bypass aktif).', 'success');
            } catch (e) {
              addLog(`Süper Mod divert başlatılamadı, proxy devam ediyor: ${e}`, 'warn');
            }
          }

          retryCount.current = 0;
          userIntentDisconnect.current = false;
          setIsConnected(true);
          setIsProcessing(false);
          addLog(t.logConnected, "success", { i18nKey: "logConnected" });
          notifyUser("DocsPI", t.logConnected, "connect");
          updateTrayTooltip("connected");
          
          if (configRef.current.lanSharing) {
            (async () => {
              try {
                const pacResult = await invoke("start_pac_server", { proxyPort: port, bypassDomains: configRef.current.customDomains || [] });
                if (pacResult?.pac_port) setPacPort(pacResult.pac_port);
                addLog(t.logPacStarted, "success", { i18nKey: "logPacStarted" });
              } catch (e) {
                addLog(t.logPacStartError(e), "warn", { i18nKey: "logPacStartError", i18nParams: [e] });
              }
            })();
          }
        }

        if (!fatalErrorRef.current && isPortInUse && (lowerLine.includes("error") || lowerLine.includes("fail") || lowerLine.includes("ftl")) && !isRetrying.current) {
          isRetrying.current = true;
          if (childProcess.current) {
            childProcess.current.kill().catch(() => {});
            childProcess.current = null;
          }
          setTimeout(() => startEngine(0, portRetryCount + 1), 1000);
        }
      };

      command.on("close", (data) => {
        if (!isRetrying.current) {
          const isUnexpectedClose = data.code !== 0 && data.code !== null;

          if (userIntentDisconnect.current) {
            addLog(t.logEngineStoppedGrace, "info", { i18nKey: "logEngineStoppedGrace" });
            setIsConnected(false);
            setIsProcessing(false);
            childProcess.current = null;
            (async () => {
              try {
                await invoke("stop_pac_server");
                await clearProxy(true);
              } catch (err) { console.error(err); }
            })();
            retryCount.current = 0;
            userIntentDisconnect.current = false;
            return;
          }

          if (isUnexpectedClose) {
            const exitCode = data.code ?? "Bilinmiyor (Zorla Kapatıldı)";
            addLog(t.logEngineStopped(exitCode), "warn", { i18nKey: "logEngineStopped", i18nParams: [exitCode] });
          } else {
            addLog(t.logEngineStoppedGrace, "info", { i18nKey: "logEngineStoppedGrace" });
          }

          const hadActiveProcess = childProcess.current !== null;

          if (connectedAt) {
            const duration = Math.floor((Date.now() - connectedAt) / 1000);
            saveSession({
              duration,
              mode: configRef.current.dpiMethod,
              networkMode: configRef.current.networkMode,
              avgPing: pingMs,
              disconnectReason: isUnexpectedClose ? 'crash' : 'stopped'
            });
            setConnectedAt(null);
          }

          setIsConnected(false);
          setIsProcessing(false);
          childProcess.current = null;
          (async () => {
            try {
              await invoke("stop_pac_server");
              await clearProxy(true);
            } catch (err) { console.error(err); }
          })();
          updateTrayTooltip("disconnected");

          const isStrongWithFake = configRef.current.dpiMethod === '2' && configRef.current.advancedBypass !== false;
          if (fatalErrorRef.current && isStrongWithFake) {
            addLog(t.logNpcapFallback || "Npcap sürücüsü yanıt vermiyor. Gelişmiş bypass kapatılıp tekrar deneniyor...", "warn");
            setConfig(prev => {
              const next = { ...prev, advancedBypass: false };
              localStorage.setItem('docspi_config', JSON.stringify(next));
              return next;
            });
            retryCount.current = 0;
            fatalErrorRef.current = false;
            setIsProcessing(true);
            attemptReconnect();
            return;
          }

          if (configRef.current.autoReconnect !== false && !userIntentDisconnect.current && !fatalErrorRef.current && hadActiveProcess) {
            // Auto-Escalate Logic
            if (configRef.current.autoEscalate !== false && isUnexpectedClose) {
              const currentMode = configRef.current.dpiMethod;
              let nextMode = null;
              if (currentMode === '0') nextMode = '1';
              else if (currentMode === '1') nextMode = '2';

              if (nextMode) {
                const modeName = nextMode === '1' ? 'Dengeli' : 'Güçlü';
                addLog(t.logAutoEscalate(modeName), 'warn');
                setConfig(prev => {
                  const next = { ...prev, dpiMethod: nextMode };
                  localStorage.setItem('docspi_config', JSON.stringify(next));
                  return next;
                });
                // setConfig asenkron olduğu için configRef'i manuel güncellemeye gerek yok (reconnect attemptReconnect içinde güncel configRef kullanacak)
              }
            }

            addLog(t.logAutoReconnect, "info", { i18nKey: "logAutoReconnect" });
            notifyUser("DocsPI", t.logAutoReconnect, "disconnect");
            setIsProcessing(true);
            attemptReconnect();
          }
        }
      });

      command.stderr.on("data", (line) => handleOutput(line, "warn"));
      command.stdout.on("data", (line) => handleOutput(line, "info"));

      const child = await command.spawn();
      childProcess.current = child;
      invoke("save_sidecar_pid", { pid: child.pid }).catch(console.warn);
      isStartingEngine.current = false;

      setTimeout(async () => {
        if (childProcess.current && !connectionConfirmed && !isRetrying.current) {
          const portReady = await waitForPort(port, 3);
          if (!portReady) {
            addLog(t.logFailsafePortClosed || "Beklenmeyen Hata: Proxy başlatılamadı", "error");
            if (childProcess.current) {
              childProcess.current.kill().catch(() => {});
              childProcess.current = null;
            }
            setIsProcessing(false);
            return;
          }

          connectionConfirmed = true;
          setCurrentPort(port);
          currentPortRef.current = port;

          try {
            await invoke("set_system_proxy", { port: port, enableWinhttp: configRef.current.enableWinhttp !== false, customBypassDomains: configRef.current.customDomains || [] });
          } catch (err) {
            addLog(t.logProxySetError(err), "error", { i18nKey: "logProxySetError", i18nParams: [err] });
          }

          retryCount.current = 0;
          userIntentDisconnect.current = false;
          setIsConnected(true);
          setIsProcessing(false);
          addLog(t.logConnected, "info", { i18nKey: "logConnected" });
          notifyUser("DocsPI", t.logConnected, "connect");
          updateTrayTooltip("connected");
          setConnectedAt(Date.now());
          
          if (configRef.current.lanSharing) {
            try {
              const pacResult = await invoke("start_pac_server", { proxyPort: port, bypassDomains: configRef.current.customDomains || [] });
              if (pacResult?.pac_port) setPacPort(pacResult.pac_port);
              addLog(t.logPacStarted, "success", { i18nKey: "logPacStarted" });
            } catch (e) {
              addLog(t.logPacStartError(e), "warn", { i18nKey: "logPacStartError", i18nParams: [e] });
            }
          }
        }
      }, DPI_TIMEOUTS[configRef.current.dpiMethod] ?? 5000);
    } catch (e) {
      isStartingEngine.current = false;
      addLog(t.logEngineStartError(e), "error", { i18nKey: "logEngineStartError", i18nParams: [e] });
      const errStr = String(e).toLowerCase();
      if (errStr.includes("denied") || errStr.includes("access") || errStr.includes("not found") || errStr.includes("os error")) {
        addLog(t.logAntivirusWarning || "Windows Defender veya antivirüs yazılımınız 'docspi-proxy.exe' dosyasını engellemiş olabilir. Lütfen dosyayı antivirüs dışlama listesine (exclusion) ekleyin.", "warn", { i18nKey: "logAntivirusWarning" });
      }
      setIsConnected(false);
      setIsProcessing(false);
      try { await clearProxy(); } catch (err) { console.error(err); }
    }
  }, [addLog, androidPlatform, buildDivertConfig, clearProxy, configRef, connectedAt, notifyUser, pingMs, resolveI18nMessage, saveSession, setConnectedAt, setCurrentPort, setIsConnected, setIsProcessing, setLanIp, setPacPort, startAndroidVpn, t, updateTrayTooltip, waitForPort]);

  // ── Adaptive DPI method check ──
  // Periodically test bypass; if failing, auto-escalate mode (0→1→2)
  const adaptiveCheckRef = useRef(null);
  useEffect(() => {
    if (isConnected && connectedAt && !androidPlatform && !vpnActive) {
      const check = async () => {
        try {
          const ok = await invoke('test_bypass_connection', { proxy_port: currentPortRef.current || 8080 });
          if (!ok) {
            const currentMode = configRef.current.dpiMethod;
            const MODE_ESCALATION = { '0': '1', '1': '2', '2': null };
            const nextMode = MODE_ESCALATION[currentMode];
            if (nextMode && configRef.current.autoEscalate !== false) {
              if (addLog) addLog(t.logAutoEscalate?.(nextMode === '1' ? 'Dengeli' : 'Güçlü') || `Bypass basarisiz, ${nextMode} moduna geciliyor...`, 'warn');
              setConfig(prev => {
                const next = { ...prev, dpiMethod: nextMode };
                localStorage.setItem('docspi_config', JSON.stringify(next));
                return next;
              });
            }
          }
        } catch (e) {
          console.warn('adaptive check error:', e);
        }
      };
      adaptiveCheckRef.current = setInterval(check, 30000);
    } else {
      if (adaptiveCheckRef.current) {
        clearInterval(adaptiveCheckRef.current);
        adaptiveCheckRef.current = null;
      }
    }
    return () => {
      if (adaptiveCheckRef.current) clearInterval(adaptiveCheckRef.current);
    };
  }, [isConnected, connectedAt, androidPlatform, vpnActive]);

  return {
    startEngine,
    startGameModeEngine,
    attemptReconnect,
    childProcess,
    isStartingEngine,
    retryCount,
    userIntentDisconnect,
    androidPlatform,
    vpnActive,
    vpnBytesRx,
    vpnBytesTx,
    startAndroidVpn,
    stopAndroidVpn,
  };
}



