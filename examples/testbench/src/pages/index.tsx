import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  Types,
  ConnectKitButton,
  Avatar,
  ChainIcon,
  useModal,
} from 'luncconnect';

import { useAccount, useConnect, useDisconnect } from 'cosmos-connect-react';

import { useTestBench } from '../TestbenchProvider';
import { Checkbox, Textbox, Select, SelectProps } from '../components/inputs';

import CustomAvatar from '../components/CustomAvatar';

const languages: SelectProps[] = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'Chinese', value: 'zh-CN' },
];

const AccountInfo = () => {
  const { address, wallet, isConnected, isConnecting, isDisconnected } =
    useAccount();

  return (
    <div className="panel">
      <h2>Wallet Info</h2>
      {isConnecting && <p>Connecting...</p>}
      {isDisconnected && <p>Disconnected</p>}
      {isConnected && (
        <table>
          <tbody>
            <tr>
              <td>Network</td>
              <td>Terra Classic</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{address}</td>
            </tr>
            <tr>
              <td>Wallet</td>
              <td>{wallet?.name}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

const Actions = () => {
  const { isConnected } = useAccount();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <h2>Actions {!isConnected && `(connect to test)`}</h2>
      <p>Actions are currently being migrated to Cosmos.</p>
    </div>
  );
};

const Home: NextPage = () => {
  const {
    theme,
    setTheme,
    customTheme,
    setCustomTheme,
    mode,
    setMode,
    options,
    setOptions,
    label,
    setLabel,
    hideAvatar,
    setHideAvatar,
    hideBalance,
    setHideBalance,
  } = useTestBench();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { open, setOpen, openAbout } = useModal({
    onConnect: () => {
      console.log('onConnect Hook');
    },
    onDisconnect: () => {
      console.log('onDisconnect Hook');
    },
  });

  const { isConnected, isConnecting, wallet } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
  };

  if (!mounted) return null;

  return (
    <>
      <main>
        <div className="panel">
          <h2>Connect Button</h2>
          <ConnectKitButton label={label} />
          {isConnected && (
            <button onClick={handleDisconnect}>Disconnect</button>
          )}
        </div>

        <div className="panel" style={{ opacity: 0.5, pointerEvents: 'none' }}>
          <h2>SIWE (Not available in Cosmos)</h2>
          <p>SIWE is currently an Ethereum-only feature.</p>
        </div>

        <div className="panel">
          <h2>useModal Hook</h2>
          <p>open: {open.toString()}</p>
          <button onClick={() => setOpen(true)}>Open modal</button>
          <button onClick={() => openAbout()}>Open to About</button>
        </div>

        <AccountInfo />

        <div className="panel">
          <h2>Chain Icons</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <ChainIcon id="columbus-5" />
            <ChainIcon id="phoenix-1" size={64} radius={6} />
          </div>
        </div>

        <div className="panel">
          <h2>Avatars</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <Avatar name="Luna" />
            <Avatar name="Terra" size={64} radius={6} />
            <Avatar name="Classic" size={32} radius={0} />
          </div>
        </div>
      </main>
      <aside>
        <ConnectKitButton.Custom>
          {({ isConnected, isConnecting, show, address, wallet }) => {
            return (
              <button onClick={show}>
                {isConnected ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    Terra Classic
                    <ChainIcon id="columbus-5" />
                    <Avatar address={address} size={12} />
                    {address}
                  </div>
                ) : (
                  <div>
                    Custom Connect {isConnecting ? 'connecting...' : ''}
                  </div>
                )}
              </button>
            );
          }}
        </ConnectKitButton.Custom>

        <p>isConnecting: {isConnecting.toString()}</p>

        <Actions />
        <h2>ConnectKitButton props</h2>
        <Textbox
          label="ConnectKitButton Label"
          value={label}
          onChange={(e: any) => {
            setLabel(e.target.value);
          }}
        />
        <Checkbox
          label="hideAvatar"
          value="hideAvatar"
          checked={hideAvatar}
          onChange={() => setHideAvatar(!hideAvatar)}
        />
        <Checkbox
          label="hideBalance"
          value="hideBalance"
          checked={hideBalance}
          onChange={() => setHideBalance(!hideBalance)}
        />
        <h2>ConnectKitProvider props</h2>
        <Select
          label="Theme"
          value={theme ?? themes[0].value}
          options={themes}
          onChange={(e) => setTheme(e.target.value as Types.Theme)}
        />
        <Select
          label="Mode"
          value={mode ?? modes[0].value}
          options={modes}
          onChange={(e) => setMode(e.target.value as Types.Mode)}
        />
        <Select
          label="Language"
          value={options.language ?? languages[0].value}
          options={languages}
          onChange={(e) =>
            setOptions({
              ...options,
              language: e.target.value as Types.Languages,
            })
          }
        />
        <h3>options</h3>
        <Textbox
          label="disclaimer"
          value={options.disclaimer as string}
          onChange={(e: any) => {
            setOptions({ ...options, disclaimer: e.target.value });
          }}
        />
        <Checkbox
          label="customAvatar"
          value="customAvatar"
          checked={options.customAvatar !== undefined}
          onChange={() =>
            setOptions({
              ...options,
              customAvatar: options.customAvatar ? undefined : CustomAvatar,
            })
          }
        />
        <Checkbox
          label="Custom Font"
          value="customFont"
          checked={customTheme['--ck-font-family'] !== undefined}
          onChange={() => {
            const name = '--ck-font-family';
            if (customTheme[name] !== undefined) {
              const { [name]: _, ...rest } = customTheme;
              setCustomTheme(rest);
            } else {
              setCustomTheme({
                ...customTheme,
                [name]: 'monospace',
              });
            }
          }}
        />
        <Select
          label={'Custom Accent'}
          value={customTheme['--ck-accent-color'] ?? ''}
          onChange={(e) => {
            const name = '--ck-accent-color';
            setCustomTheme({
              ...customTheme,
              [name]: e.target.value,
            });
          }}
          options={[
            { label: 'none', value: '' },
            { label: 'red', value: 'red' },
            { label: 'blue', value: 'blue' },
            { label: 'green', value: 'green' },
            { label: 'yellow', value: 'yellow' },
            { label: 'purple', value: 'purple' },
            { label: 'orange', value: 'orange' },
          ]}
        />
        <Checkbox
          label="reduceMotion"
          value="reduceMotion"
          checked={options.reducedMotion as boolean}
          onChange={() =>
            setOptions({ ...options, reducedMotion: !options.reducedMotion })
          }
        />
        <Checkbox
          label="hideBalance"
          value="hideBalance"
          checked={options.hideBalance as boolean}
          onChange={() =>
            setOptions({
              ...options,
              hideBalance: !options.hideBalance,
            })
          }
        />
        <Checkbox
          label="hideTooltips"
          value="hideTooltips"
          checked={options.hideTooltips as boolean}
          onChange={() =>
            setOptions({ ...options, hideTooltips: !options.hideTooltips })
          }
        />
        <Checkbox
          label="hideQuestionMarkCTA"
          value="hideQuestionMarkCTA"
          checked={options.hideQuestionMarkCTA as boolean}
          onChange={() =>
            setOptions({
              ...options,
              hideQuestionMarkCTA: !options.hideQuestionMarkCTA,
            })
          }
        />
        <Checkbox
          label="hideNoWalletCTA"
          value="hideNoWalletCTA"
          checked={options.hideNoWalletCTA as boolean}
          onChange={() =>
            setOptions({
              ...options,
              hideNoWalletCTA: !options.hideNoWalletCTA,
            })
          }
        />
        <Checkbox
          label="avoidLayoutShift"
          value="avoidLayoutShift"
          checked={options.avoidLayoutShift as boolean}
          onChange={() =>
            setOptions({
              ...options,
              avoidLayoutShift: !options.avoidLayoutShift,
            })
          }
        />
        <Checkbox
          disabled
          label="embedGoogleFonts"
          value="embedGoogleFonts"
          checked={options.embedGoogleFonts as boolean}
          onChange={() =>
            setOptions({
              ...options,
              embedGoogleFonts: !options.embedGoogleFonts,
            })
          }
        />
        <Select
          label="walletConnectCTA"
          value={options.walletConnectCTA as string}
          options={[
            { label: 'modal', value: 'modal' },
            { label: 'link', value: 'link' },
            { label: 'both', value: 'both' },
          ]}
          onChange={(e) =>
            setOptions({
              ...options,
              walletConnectCTA: e.target.value as any,
            })
          }
        />
        <label htmlFor="overlayBlur">
          overlayBlur <code>{options.overlayBlur}</code>
        </label>
        <input
          id="overlayBlur"
          type="range"
          min="0"
          max="50"
          value={options.overlayBlur}
          onChange={(e) => {
            setOptions({
              ...options,
              overlayBlur: parseInt(e.target.value),
            });
          }}
        />
      </aside>
    </>
  );
};

export default Home;
