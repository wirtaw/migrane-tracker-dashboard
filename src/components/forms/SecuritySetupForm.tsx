import React, { useState } from 'react';
import sjcl, { SjclCipherEncrypted } from 'sjcl';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { ProfileSecurityData } from '../../models/profileData.types';

interface SecuritySetupFormProps {
  onSubmit: () => void;
}

function generateSalt(words: number, paranoia: number): string {
  const salt: string = sjcl.random.randomWords(words, paranoia).toString();

  return salt;
}

const encrypt = (data: string | SjclCipherEncrypted, key: string) => {
  return JSON.stringify(sjcl.encrypt(key, JSON.stringify(data)));
};

const decrypt = (data: string | SjclCipherEncrypted, key: string) => {
  return JSON.parse(sjcl.decrypt(key, data));
};

const decryptProfilePassword = (data: ProfileSecurityData) => {
  const { key, password } = data;
  if (!key || !password) {
    return '';
  }
  return decrypt(password, key);
};

const encryptProfilePassword = (data: ProfileSecurityData, password: string) => {
  const { key } = data;
  if (!key) {
    return '';
  }
  return encrypt(password, key);
};

export default function SecuritySetupForm({ onSubmit }: SecuritySetupFormProps) {
  const {
    profileSettingsData,
    setProfileSettingsData,
    profileSecurityData,
    setProfileSecurityData,
  } = useProfileDataContext();
  const [password, setPassword] = useState<string>(decryptProfilePassword(profileSecurityData));
  const [salt, setSalt] = useState<string>(profileSecurityData.salt);

  const handleHashEncryption = () => {
    try {
      if (!sjcl) {
        throw new Error('sjcl not available');
      }

      setSalt(generateSalt(2, 0));

      const key = sjcl.misc.pbkdf2(password, salt, 10000, 256);

      localStorage.setItem(
        'encryptedProfile',
        JSON.stringify(sjcl.encrypt(key, JSON.stringify(profileSettingsData)))
      );
      localStorage.setItem('key', JSON.stringify(key));

      setProfileSecurityData({
        ...profileSecurityData,
        password: encryptProfilePassword(profileSecurityData, password),
        salt,
        key: sjcl.codec.hex.fromBits(key),
        isInit: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    setProfileSettingsData({ ...profileSettingsData, securitySetup: true });
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password:
        </label>
        <input
          id="newPassword"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <button
          type="button"
          onClick={handleHashEncryption}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate Key
        </button>
      </div>
      <div>
        <label
          htmlFor="newSalt"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Salt:
        </label>
        <input
          id="newSalt"
          value={salt}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="newProfileData"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Encrypted Profile Data:
        </label>
        <textarea
          id="newProfileData"
          rows={3}
          value={JSON.stringify(profileSettingsData)}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        ></textarea>
      </div>
      <button type="submit" className="bg-indigo-500 text-white rounded-md p-2 text-sm">
        Save
      </button>
    </form>
  );
}
