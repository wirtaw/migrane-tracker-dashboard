import {
  IIncident,
  ITrigger,
  IMedication,
  ISymptom,
  IBrokenTrigger,
  IBrokenIncident,
  IBrokenMedication,
  IBrokenSymptom,
  ILocationData,
  IBrokenLocation,
  IWeight,
  IHeight,
  IBloodPressure,
  ISleep,
  IWater,
  IBrokenWeight,
  IBrokenHeight,
  IBrokenBloodPressure,
  IBrokenSleep,
  IBrokenWater,
} from '../models/profileData.types';

export interface IValidationResult {
  validData: {
    incidents: IIncident[];
    triggers: ITrigger[];
    medications: IMedication[];
    symptoms: ISymptom[];
    locations: ILocationData[];
    healthLogs: {
      weights: IWeight[];
      heights: IHeight[];
      bloodPressures: IBloodPressure[];
      sleeps: ISleep[];
      waters: IWater[];
    };
  };
  brokenData: {
    incidents: IBrokenIncident[];
    triggers: IBrokenTrigger[];
    medications: IBrokenMedication[];
    symptoms: IBrokenSymptom[];
    locations: IBrokenLocation[];
    healthLogs: {
      weights: IBrokenWeight[];
      heights: IBrokenHeight[];
      bloodPressures: IBrokenBloodPressure[];
      sleeps: IBrokenSleep[];
      waters: IBrokenWater[];
    };
  };
}

export interface IMaxIds {
  incidents: number;
  triggers: number;
  medications: number;
  symptoms: number;
  weights: number;
  heights: number;
  bloodPressures: number;
  sleeps: number;
  waters: number;
}

export const validateImportData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  maxIds: IMaxIds
): IValidationResult => {
  const result: IValidationResult = {
    validData: {
      incidents: [],
      triggers: [],
      medications: [],
      symptoms: [],
      locations: [],
      healthLogs: {
        weights: [],
        heights: [],
        bloodPressures: [],
        sleeps: [],
        waters: [],
      },
    },
    brokenData: {
      incidents: [],
      triggers: [],
      medications: [],
      symptoms: [],
      locations: [],
      healthLogs: {
        weights: [],
        heights: [],
        bloodPressures: [],
        sleeps: [],
        waters: [],
      },
    },
  };

  if (!data) return result;

  const {
    incidents: jsonDataIncidents,
    triggers: jsonDataTriggers,
    medications: jsonDataMedications,
    symptoms: jsonDataSymptoms,
    logsForecast: jsonDataLogsForecast,
    logHealth: logHealthLegacy,
    healthLogs: logHealthStandard,
  } = data;

  const jsonDataLogHealth = logHealthStandard || logHealthLegacy;

  // 1. Validate Incidents
  if (jsonDataIncidents && Array.isArray(jsonDataIncidents)) {
    let currentMaxId = maxIds.incidents;
    for (const incident of jsonDataIncidents) {
      const { id, userId, datetimeAt, type, startTime, durationHours, triggers, notes, createdAt } =
        incident;

      if (!userId) {
        result.brokenData.incidents.push({
          ...incident,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
          warning: 'Incident missing userId',
        });
        continue;
      }
      if (!datetimeAt) {
        result.brokenData.incidents.push({
          ...incident,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
          warning: 'Incident missing datetimeAt',
        });
        continue;
      }
      if (!type) {
        result.brokenData.incidents.push({
          ...incident,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
          warning: 'Incident missing type',
        });
        continue;
      }
      if (!startTime) {
        result.brokenData.incidents.push({
          ...incident,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
          warning: 'Incident missing startTime',
        });
        continue;
      }
      if (!durationHours) {
        result.brokenData.incidents.push({
          ...incident,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
          warning: 'Incident missing durationHours',
        });
        continue;
      }
      if (triggers && !Array.isArray(triggers)) {
        result.brokenData.incidents.push({
          ...incident,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
          warning: 'Incident triggers is not an array',
        });
        continue;
      }

      const setId = id || currentMaxId + 1;
      result.validData.incidents.push({
        id: setId,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
        durationHours,
        triggers,
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        notes: notes || '',
      });
      if (setId > currentMaxId) currentMaxId = setId;
    }
  }

  // 2. Validate Triggers
  if (jsonDataTriggers && Array.isArray(jsonDataTriggers)) {
    let currentMaxId = maxIds.triggers;
    for (const trigger of jsonDataTriggers) {
      const { id, userId, datetimeAt, type, note, createdAt } = trigger;

      if (!userId) {
        result.brokenData.triggers.push({
          ...trigger,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          warning: 'Trigger missing userId',
        });
        continue;
      }
      if (!datetimeAt) {
        result.brokenData.triggers.push({
          ...trigger,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          warning: 'Trigger missing datetimeAt',
        });
        continue;
      }
      if (!type) {
        result.brokenData.triggers.push({
          ...trigger,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          warning: 'Trigger missing type',
        });
        continue;
      }

      const setId = id || currentMaxId + 1;
      result.validData.triggers.push({
        id: setId.toString(),
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        note: note || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
      });
      if (setId > currentMaxId) currentMaxId = setId;
    }
  }

  // 3. Validate Medications
  if (jsonDataMedications && Array.isArray(jsonDataMedications)) {
    let currentMaxId = maxIds.medications;
    for (const medication of jsonDataMedications) {
      const { id, userId, datetimeAt, title, dosage, notes, createdAt, updateAt } = medication;

      if (!userId) {
        result.brokenData.medications.push({
          ...medication,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          warning: 'Medication missing userId',
        });
        continue;
      }
      if (!datetimeAt) {
        result.brokenData.medications.push({
          ...medication,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          warning: 'Medication missing datetimeAt',
        });
        continue;
      }
      if (!title) {
        result.brokenData.medications.push({
          ...medication,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          warning: 'Medication missing title',
        });
        continue;
      }
      if (!dosage) {
        result.brokenData.medications.push({
          ...medication,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          warning: 'Medication missing dosage',
        });
        continue;
      }

      const setId = id || currentMaxId + 1;
      result.validData.medications.push({
        id: setId,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        title,
        dosage,
        notes: notes || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        updateAt: typeof updateAt === 'string' ? new Date(updateAt) : new Date(),
      });
      if (setId > currentMaxId) currentMaxId = setId;
    }
  }

  // 4. Validate Symptoms
  if (jsonDataSymptoms && Array.isArray(jsonDataSymptoms)) {
    let currentMaxId = maxIds.symptoms;
    for (const symptom of jsonDataSymptoms) {
      const { id, userId, datetimeAt, type, severity, notes, note, createdAt } = symptom;

      if (!userId) {
        result.brokenData.symptoms.push({
          ...symptom,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          warning: 'Symptom missing userId',
        });
        continue;
      }
      if (!datetimeAt) {
        result.brokenData.symptoms.push({
          ...symptom,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          warning: 'Symptom missing datetimeAt',
        });
        continue;
      }
      if (!type) {
        result.brokenData.symptoms.push({
          ...symptom,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          warning: 'Symptom missing type',
        });
        continue;
      }
      if (!severity) {
        result.brokenData.symptoms.push({
          ...symptom,
          id: 0,
          userId: String(userId),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          warning: 'Symptom missing severity',
        });
        continue;
      }

      const setId = id || currentMaxId + 1;
      result.validData.symptoms.push({
        id: id ? id.toString() : crypto.randomUUID(),
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        severity,
        note: notes || note || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
      });
      if (setId > currentMaxId) currentMaxId = setId;
    }
  }

  // 5. Validate Locations
  if (jsonDataLogsForecast && Array.isArray(jsonDataLogsForecast)) {
    for (const location of jsonDataLogsForecast) {
      const {
        id,
        userId,
        datetimeAt,
        incidentId,
        solarRadiation,
        solar,
        forecast,
        longitude,
        latitude,
      } = location;

      if (!userId) {
        result.brokenData.locations.push({
          ...location,
          warning: 'Location missing userId',
          id: 0,
        });
        continue;
      }
      if (!datetimeAt) {
        result.brokenData.locations.push({
          ...location,
          warning: 'Location missing datetimeAt',
          id: 0,
        });
        continue;
      }
      if (!longitude) {
        result.brokenData.locations.push({
          ...location,
          warning: 'Location missing longitude',
          id: 0,
        });
        continue;
      }
      if (!latitude) {
        result.brokenData.locations.push({
          ...location,
          warning: 'Location missing latitude',
          id: 0,
        });
        continue;
      }
      if (!forecast || !Array.isArray(forecast)) {
        result.brokenData.locations.push({
          ...location,
          warning: 'Location missing forecast',
          id: 0,
        });
        continue;
      }
      if (!solarRadiation || !Array.isArray(solarRadiation)) {
        result.brokenData.locations.push({
          ...location,
          warning: 'Location missing solarRadiation',
          id: 0,
        });
        continue;
      }
      if (!solar || !Array.isArray(solar)) {
        result.brokenData.locations.push({ ...location, warning: 'Location missing solar', id: 0 });
        continue;
      }

      result.validData.locations.push({
        id: id ? id.toString() : crypto.randomUUID(),
        userId: userId.toString(),
        longitude,
        latitude,
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        incidentId: incidentId ? incidentId.toString() : null,
        solarRadiation,
        forecast,
        solar,
      });
    }
  }

  // 6. Validate Health Logs
  if (jsonDataLogHealth) {
    if (jsonDataLogHealth.weights && Array.isArray(jsonDataLogHealth.weights)) {
      let currentMaxId = maxIds.weights;
      for (const w of jsonDataLogHealth.weights) {
        const { id, userId, datetimeAt, weight: weightValue, notes } = w;
        if (!userId) {
          result.brokenData.healthLogs.weights.push({
            ...w,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'Weight missing userId',
          });
          continue;
        }
        if (!datetimeAt) {
          result.brokenData.healthLogs.weights.push({
            ...w,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'Weight missing datetimeAt',
          });
          continue;
        }
        if (weightValue === undefined || weightValue === null) {
          result.brokenData.healthLogs.weights.push({
            ...w,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'Weight missing value',
          });
          continue;
        }

        const setId = id || currentMaxId + 1;
        result.validData.healthLogs.weights.push({
          id: setId,
          userId: userId.toString(),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          weight: weightValue,
          notes: notes || '',
        });
        if (setId > currentMaxId) currentMaxId = setId;
      }
    }

    if (jsonDataLogHealth.heights && Array.isArray(jsonDataLogHealth.heights)) {
      let currentMaxId = maxIds.heights;
      for (const h of jsonDataLogHealth.heights) {
        const { id, userId, datetimeAt, height: heightValue, notes } = h;
        if (!userId) {
          result.brokenData.healthLogs.heights.push({
            ...h,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'Height missing userId',
          });
          continue;
        }
        if (!datetimeAt) {
          result.brokenData.healthLogs.heights.push({
            ...h,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'Height missing datetimeAt',
          });
          continue;
        }
        if (heightValue === undefined || heightValue === null) {
          result.brokenData.healthLogs.heights.push({
            ...h,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'Height missing value',
          });
          continue;
        }

        const setId = id || currentMaxId + 1;
        result.validData.healthLogs.heights.push({
          id: setId,
          userId: userId.toString(),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          height: heightValue,
          notes: notes || '',
        });
        if (setId > currentMaxId) currentMaxId = setId;
      }
    }

    if (jsonDataLogHealth.bloodPressures && Array.isArray(jsonDataLogHealth.bloodPressures)) {
      let currentMaxId = maxIds.bloodPressures;
      for (const bp of jsonDataLogHealth.bloodPressures) {
        const { id, userId, datetimeAt, systolic, diastolic, notes } = bp;
        if (!userId) {
          result.brokenData.healthLogs.bloodPressures.push({
            ...bp,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'BP missing userId',
          });
          continue;
        }
        if (!datetimeAt) {
          result.brokenData.healthLogs.bloodPressures.push({
            ...bp,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'BP missing datetimeAt',
          });
          continue;
        }
        if (systolic === undefined || systolic === null) {
          result.brokenData.healthLogs.bloodPressures.push({
            ...bp,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'BP missing systolic',
          });
          continue;
        }
        if (diastolic === undefined || diastolic === null) {
          result.brokenData.healthLogs.bloodPressures.push({
            ...bp,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'BP missing diastolic',
          });
          continue;
        }

        const setId = id || currentMaxId + 1;
        result.validData.healthLogs.bloodPressures.push({
          id: setId,
          userId: userId.toString(),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          systolic,
          diastolic,
          notes: notes || '',
        });
        if (setId > currentMaxId) currentMaxId = setId;
      }
    }

    if (jsonDataLogHealth.sleeps && Array.isArray(jsonDataLogHealth.sleeps)) {
      let currentMaxId = maxIds.sleeps;
      for (const sleep of jsonDataLogHealth.sleeps) {
        const {
          id,
          userId,
          datetimeAt,
          rate,
          minutesTotal,
          minutesDeep,
          minutesRem,
          timesWakeUp,
          startedAt,
          notes,
        } = sleep;
        if (!userId) {
          result.brokenData.healthLogs.sleeps.push({
            ...sleep,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'Sleep missing userId',
          });
          continue;
        }
        if (!datetimeAt) {
          result.brokenData.healthLogs.sleeps.push({
            ...sleep,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'Sleep missing datetimeAt',
          });
          continue;
        }

        const setId = id || currentMaxId + 1;
        result.validData.healthLogs.sleeps.push({
          id: setId,
          userId: userId.toString(),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          rate,
          minutesTotal,
          minutesDeep,
          minutesRem,
          timesWakeUp,
          startedAt,
          notes: notes || '',
        });
        if (setId > currentMaxId) currentMaxId = setId;
      }
    }

    if (jsonDataLogHealth.waters && Array.isArray(jsonDataLogHealth.waters)) {
      let currentMaxId = maxIds.waters;
      for (const w of jsonDataLogHealth.waters) {
        const { id, userId, datetimeAt, ml, notes } = w;
        if (!userId) {
          result.brokenData.healthLogs.waters.push({
            ...w,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'Water missing userId',
          });
          continue;
        }
        if (!datetimeAt) {
          result.brokenData.healthLogs.waters.push({
            ...w,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'Water missing datetimeAt',
          });
          continue;
        }
        if (ml === undefined || ml === null) {
          result.brokenData.healthLogs.waters.push({
            ...w,
            id: 0,
            userId: String(userId),
            datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
            warning: 'Water missing ml',
          });
          continue;
        }

        const setId = id || currentMaxId + 1;
        result.validData.healthLogs.waters.push({
          id: setId,
          userId: userId.toString(),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          ml,
          notes: notes || '',
        });
        if (setId > currentMaxId) currentMaxId = setId;
      }
    }
  }

  return result;
};
