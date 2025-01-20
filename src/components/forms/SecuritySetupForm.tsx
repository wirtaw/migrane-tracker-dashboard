import React, { useState } from 'react';
import sjcl, { SjclCipherEncrypted } from 'sjcl';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { ProfileSecurityData } from '../../models/profileData.types';
import { env } from '../../config/env';

interface SecuritySetupFormProps {
  onSubmit: () => void;
}

function generateSalt(words: number, paranoia: number): sjcl.BitArray {
  const salt: sjcl.BitArray = sjcl.random.randomWords(words, paranoia);

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
  const [salt, setSalt] = useState<sjcl.BitArray>(sjcl.codec.hex.toBits(profileSecurityData.salt));

  const handleSubmit = (e: React.FormEvent) => {
    try {
      if (!sjcl) {
        throw new Error('sjcl not available');
      }

      const key = sjcl.misc.pbkdf2(password, salt, env.SJCL_KEY_STRENGTH_FACTOR, env.SJCL_KEY_SIZE);

      localStorage.setItem(
        'encryptedProfile',
        JSON.stringify(sjcl.encrypt(key, JSON.stringify(profileSettingsData)))
      );
      localStorage.setItem('key', JSON.stringify(key));

      setProfileSecurityData({
        ...profileSecurityData,
        password: encryptProfilePassword(profileSecurityData, password),
        salt: sjcl.codec.hex.fromBits(salt),
        key: sjcl.codec.hex.fromBits(key),
        isInit: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setProfileSettingsData({ ...profileSettingsData, securitySetup: true });
      e.preventDefault();
      onSubmit();
    }
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
          onClick={() =>
            setSalt(generateSalt(env.SJCL_GENERATE_SALT_WORDS, env.SJCL_GENERATE_SALT_PARANOIA))
          }
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate salt
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
          value={sjcl.codec.hex.fromBits(salt)}
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
