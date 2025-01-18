import React, { useState, useEffect } from 'react';
import * as bip39 from 'bip39';
import { useProfileDataContext } from '../../context/ProfileDataContext';

interface SecuritySetupFormProps {
  onSubmit: () => void;
}

async function generateEd25519Key(): Promise<{ publicKey: CryptoKey; privateKey: CryptoKey }> {
  // Generate a new Ed25519 key pair
  const keypair = await window.crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign', 'verify']
  );

  return {
    publicKey: keypair.publicKey,
    privateKey: keypair.privateKey,
  };
}

export default function SecuritySetupForm({ onSubmit }: SecuritySetupFormProps) {
  const { profileSettingsData, setProfileSettingsData } = useProfileDataContext();
  const [, setSecureKeys] = useState<{ publicKey: CryptoKey; privateKey: CryptoKey } | null>(null);
  const [newSecuritySetup, setNewSecuritySetup] = useState('');

  useEffect(() => {
    async function generateAndStoreKeys() {
      const keys = await generateEd25519Key();
      setSecureKeys(keys);
      const rawKey = await window.crypto.subtle.exportKey('raw', keys.privateKey);
      const keyHash = await window.crypto.subtle.digest('SHA-256', rawKey);
      const encryptionKey = await window.crypto.subtle.importKey(
        'raw',
        keyHash,
        { name: 'AES-GCM' },
        false, // Not extractable
        ['encrypt', 'decrypt']
      );

      // 3. Generate Mnemonic Phrase
      const exportedKey = await window.crypto.subtle.exportKey('jwk', keys.privateKey);
      const privateKeyJwk = JSON.stringify(exportedKey);
      const mnemonic = bip39.entropyToMnemonic(privateKeyJwk); // Use the JWK as entropy

      // 4. Encrypt Profile Data
      const encodedData = new TextEncoder().encode(JSON.stringify(profileSettingsData));
      const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        encryptionKey,
        encodedData
      );

      // 5. Store Data
      localStorage.setItem(
        'encryptedProfile',
        JSON.stringify({
          data: Array.from(new Uint8Array(encryptedData)),
          iv: Array.from(iv),
        })
      );
      localStorage.setItem('mnemonic', mnemonic);
      setNewSecuritySetup(mnemonic);

      return { mnemonic };
    }

    generateAndStoreKeys();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    setProfileSettingsData({ ...profileSettingsData, securitySetup: true });
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="newSecuritySetup"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Security Reovery Words:
        </label>
        <textarea
          id="newSecuritySetup"
          rows={3}
          value={newSecuritySetup}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        ></textarea>
      </div>
      <button type="submit" className="bg-indigo-500 text-white rounded-md p-2 text-sm">
        Save
      </button>
    </form>
  );
}
