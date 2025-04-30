import React from 'react';
import { useNavigate } from 'react-router-dom';

const IndicatorDetailsPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // -1 goes back one step in the history
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-5">
        <h1 className="text-2xl font-semibold mb-4 dark:text-white">Indicator Details</h1>
      </div>
      <div className="p-6 dark:bg-gray-800 dark:text-white">
        <div className="mb-6">
          <h2 id="uv-index" className="text-xl font-semibold mb-2">
            UV Index
          </h2>
          <p>
            The UV index is a measure of the level of ultraviolet (UV) radiation from the sun
            expected at a particular place and time. It is a predictor of the likelihood of skin
            damage from overexposure to the sun.
          </p>
          <ul className="list-disc ml-5">
            <li>Low (0-2): Minimal risk from unprotected sun exposure.</li>
            <li>Moderate (3-5): Moderate risk; use sunscreen, wear protective clothing.</li>
            <li>High (6-7): High risk; protection essential.</li>
            <li>Very High (8-10): Very high risk; take extra precautions.</li>
            <li>Extreme (11+): Extreme risk; avoid sun exposure during peak hours.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 id="k-index" className="text-xl font-semibold mb-2">
            K-Index
          </h2>
          <p>
            The K-index is a quasi-logarithmic index that measures the maximum deviation of one
            horizontal component of the Earth's magnetic field compared to a quiet day curve, within
            a 3-hour interval. It ranges from 0 to 9.
          </p>
          <ul className="list-disc ml-5">
            <li>0-2: Quiet geomagnetic conditions.</li>
            <li>3: Unsettled.</li>
            <li>4: Minor geomagnetic storm.</li>
            <li>5: Moderate geomagnetic storm.</li>
            <li>6: Strong geomagnetic storm.</li>
            <li>7: Severe geomagnetic storm.</li>
            <li>8-9: Extreme geomagnetic storm.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 id="a-index" className="text-xl font-semibold mb-2">
            A-Index
          </h2>
          <p>
            The A-index is a daily average of the geomagnetic activity based on the 3-hourly
            K-index. It provides a more linear scale for measuring the overall level of geomagnetic
            disturbance.
          </p>
          <ul className="list-disc ml-5">
            <li>Quiet (0-7): Minimal geomagnetic activity.</li>
            <li>Unsettled (8-15): Slightly disturbed geomagnetic conditions.</li>
            <li>Active (16-29): Increased geomagnetic activity.</li>
            <li>Minor Storm (30-49): Low-level geomagnetic storm.</li>
            <li>Major Storm (50-99): Significant geomagnetic storm.</li>
            <li>Severe Storm (100-400): Intense geomagnetic storm.</li>
            <li>Extreme Storm ({'>'}400): Very severe geomagnetic storm.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 id="ozone" className="text-xl font-semibold mb-2">
            Ozone
          </h2>
          <p>
            Ozone concentration in the atmosphere is often measured in Dobson Units (DU) for
            stratospheric ozone and parts per billion (ppb) for ground-level ozone.
          </p>
          <ul className="list-disc ml-5">
            <li>
              Low: Less than 200 DU (stratosphere) or below 50 ppb (ground level). Minimal ozone
              present, concerns about UV exposure if stratospheric.
            </li>
            <li>
              Moderate: 200–300 DU (stratosphere); 50–100 ppb (ground level). Balanced levels,
              supporting UV protection and air quality.
            </li>
            <li>
              High: Above 300 DU (stratosphere) or over 100 ppb (ground level). Potential for strong
              UV protection in stratosphere but air quality issues at ground level.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 id="solar-flux" className="text-xl font-semibold mb-2">
            Solar Flux
          </h2>
          <p>
            Solar radio flux at 10.7 cm wavelength (F10.7 index) is a measure of solar activity,
            expressed in solar flux units (sfu).
          </p>
          <ul className="list-disc ml-5">
            <li>
              Low Activity: Below 80 sfu. Quiet solar conditions, fewer disturbances to satellites
              or radio communications.
            </li>
            <li>
              Moderate Activity: Between 80–150 sfu. Increased activity, potential for auroras and
              minor satellite impacts.
            </li>
            <li>
              High Activity: Above 150 sfu. Strong solar activity, possibly leading to geomagnetic
              storms and disruptions.
            </li>
          </ul>
        </div>

        <div>
          <h2 id="sunspot-number" className="text-xl font-semibold mb-2">
            Sunspot Number
          </h2>
          <p>
            The sunspot number is a measure of the number of sunspots and groups of sunspots visible
            on the surface of the Sun. It is an indicator of solar activity.
          </p>
          <ul className="list-disc ml-5">
            <li>
              Low: Fewer than 20 sunspots (solar minimum). Calm solar conditions, minimal impact on
              Earth's magnetosphere.
            </li>
            <li>
              Moderate: Between 20–100 sunspots. Growing solar activity, more dynamic space weather.
            </li>
            <li>
              High: Over 100 sunspots (solar maximum). Active solar periods, greater influence on
              geomagnetic storms and auroras.
            </li>
          </ul>
        </div>

        <button onClick={goBack} className="inline-block mt-4 text-blue-500 hover:underline">
          Back
        </button>
      </div>
    </main>
  );
};

export default IndicatorDetailsPage;
