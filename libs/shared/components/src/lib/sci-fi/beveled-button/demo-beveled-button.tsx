import React, { useState, forwardRef } from 'react';
import {
  Save,
  Download,
  Heart,
  Settings,
  ArrowRight,
  Plus,
  Check,
} from 'lucide-react';

import {
  BeveledButton,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from './beveled-button';

export const BeveledButtonDemo = () => {
  const variants: ButtonVariant[] = ['contained', 'outlined', 'text'];
  const colors: ButtonColor[] = [
    'primary',
    'secondary',
    'success',
    'error',
    'warning',
    'info',
  ];
  const sizes: ButtonSize[] = ['small', 'medium', 'large'];

  const [demoVariant, setDemoVariant] = useState(variants[0]);
  const [demoColor, setDemoColor] = useState(colors[0]);
  const [demoSize, setDemoSize] = useState(sizes[1]);
  const [demoDisabled, setDemoDisabled] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoFullWidth, setDemoFullWidth] = useState(false);
  const [demoDisableElevation, setDemoDisableElevation] = useState(false);
  const [demoStartIcon, setDemoStartIcon] = useState(false);
  const [demoEndIcon, setDemoEndIcon] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            BeveledButton Component
          </h1>
          <p className="text-gray-600">
            A customizable button component with beveled edges, multiple
            variants, and interactive states.
          </p>
        </div>

        {/* Interactive Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Interactive Demo</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variant
                </label>
                <div className="flex gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setDemoVariant(variant)}
                      className={`px-3 py-1 text-sm rounded ${
                        demoVariant === variant
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setDemoColor(color)}
                      className={`px-3 py-1 text-sm rounded capitalize ${
                        demoColor === color
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setDemoSize(size)}
                      className={`px-3 py-1 text-sm rounded ${
                        demoSize === size
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={demoDisabled}
                    onChange={(e) => setDemoDisabled(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Disabled</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={demoLoading}
                    onChange={(e) => setDemoLoading(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Loading</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={demoFullWidth}
                    onChange={(e) => setDemoFullWidth(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Full Width</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={demoDisableElevation}
                    onChange={(e) => setDemoDisableElevation(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Disable Elevation</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={demoStartIcon}
                    onChange={(e) => setDemoStartIcon(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Start Icon</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={demoEndIcon}
                    onChange={(e) => setDemoEndIcon(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">End Icon</span>
                </label>
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Live Preview</h3>
              <div className="flex items-center justify-center min-h-[200px]">
                <BeveledButton
                  variant={demoVariant}
                  color={demoColor}
                  size={demoSize}
                  disabled={demoDisabled}
                  loading={demoLoading}
                  fullWidth={demoFullWidth}
                  disableElevation={demoDisableElevation}
                  startIcon={demoStartIcon ? <Save size={16} /> : undefined}
                  endIcon={demoEndIcon ? <ArrowRight size={16} /> : undefined}
                  onClick={() => alert('Button clicked!')}
                >
                  {demoLoading ? 'Loading...' : 'Demo Button'}
                </BeveledButton>
              </div>

              {/* Code Preview */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Generated Code:</h4>
                <pre className="bg-gray-800 text-green-400 p-4 rounded text-xs overflow-x-auto">
                  {`<BeveledButton
  variant="${demoVariant}"
  color="${demoColor}"
  size="${demoSize}"${demoDisabled ? '\n  disabled' : ''}${
                    demoLoading ? '\n  loading' : ''
                  }${demoFullWidth ? '\n  fullWidth' : ''}${
                    demoDisableElevation ? '\n  disableElevation' : ''
                  }${demoStartIcon ? '\n  startIcon={<Save />}' : ''}${
                    demoEndIcon ? '\n  endIcon={<ArrowRight />}' : ''
                  }
  onClick={handleClick}
>
  ${demoLoading ? 'Loading...' : 'Demo Button'}
</BeveledButton>`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Variant Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Variants</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Contained</h3>
              <div className="space-y-3">
                {colors.map((color) => (
                  <BeveledButton key={color} variant="contained" color={color}>
                    {color}
                  </BeveledButton>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Outlined</h3>
              <div className="space-y-3">
                {colors.map((color) => (
                  <BeveledButton key={color} variant="outlined" color={color}>
                    {color}
                  </BeveledButton>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Text</h3>
              <div className="space-y-3">
                {colors.map((color) => (
                  <BeveledButton key={color} variant="text" color={color}>
                    {color}
                  </BeveledButton>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Size Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Sizes</h2>
          <div className="flex items-end gap-4">
            <BeveledButton size="small">Small</BeveledButton>
            <BeveledButton size="medium">Medium</BeveledButton>
            <BeveledButton size="large">Large</BeveledButton>
          </div>
        </div>

        {/* Icon Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">With Icons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Start Icons</h3>
              <div className="space-y-3">
                <BeveledButton startIcon={<Save size={16} />}>
                  Save
                </BeveledButton>
                <BeveledButton
                  startIcon={<Download size={16} />}
                  variant="outlined"
                >
                  Download
                </BeveledButton>
                <BeveledButton startIcon={<Plus size={16} />} variant="text">
                  Add New
                </BeveledButton>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">End Icons</h3>
              <div className="space-y-3">
                <BeveledButton endIcon={<ArrowRight size={16} />}>
                  Continue
                </BeveledButton>
                <BeveledButton
                  endIcon={<Settings size={16} />}
                  variant="outlined"
                >
                  Settings
                </BeveledButton>
                <BeveledButton
                  endIcon={<Heart size={16} />}
                  variant="text"
                  color="error"
                >
                  Like
                </BeveledButton>
              </div>
            </div>
          </div>
        </div>

        {/* States Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">States</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Normal</h3>
              <BeveledButton>Click Me</BeveledButton>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Disabled</h3>
              <BeveledButton disabled>Disabled</BeveledButton>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Loading</h3>
              <BeveledButton loading>Loading</BeveledButton>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">No Elevation</h3>
              <BeveledButton disableElevation>Flat Button</BeveledButton>
            </div>
          </div>
        </div>

        {/* Full Width Example */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Full Width</h2>
          <div className="space-y-4">
            <BeveledButton fullWidth>Full Width Button</BeveledButton>
            <BeveledButton
              fullWidth
              variant="outlined"
              startIcon={<Check size={16} />}
            >
              Full Width with Icon
            </BeveledButton>
          </div>
        </div>

        {/* API Documentation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">API Documentation</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Prop
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Default
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    variant
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    'contained' | 'outlined' | 'text'
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    'contained'
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    The visual style variant of the button
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    color
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    'primary' | 'secondary' | 'error' | 'warning' | 'info' |
                    'success'
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    'primary'
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    The color theme of the button
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    size
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    'small' | 'medium' | 'large'
                  </td>
                  <td className="border border-gray-300 px-4 py-2">'medium'</td>
                  <td className="border border-gray-300 px-4 py-2">
                    The size of the button
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    fullWidth
                  </td>
                  <td className="border border-gray-300 px-4 py-2">boolean</td>
                  <td className="border border-gray-300 px-4 py-2">false</td>
                  <td className="border border-gray-300 px-4 py-2">
                    If true, the button will take up the full width of its
                    container
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    disabled
                  </td>
                  <td className="border border-gray-300 px-4 py-2">boolean</td>
                  <td className="border border-gray-300 px-4 py-2">false</td>
                  <td className="border border-gray-300 px-4 py-2">
                    If true, the button will be disabled
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    disableElevation
                  </td>
                  <td className="border border-gray-300 px-4 py-2">boolean</td>
                  <td className="border border-gray-300 px-4 py-2">false</td>
                  <td className="border border-gray-300 px-4 py-2">
                    If true, no elevation/shadow effects will be applied
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    loading
                  </td>
                  <td className="border border-gray-300 px-4 py-2">boolean</td>
                  <td className="border border-gray-300 px-4 py-2">false</td>
                  <td className="border border-gray-300 px-4 py-2">
                    If true, a loading spinner will be shown
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    startIcon
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    React.ReactNode
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    undefined
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Element placed before the button text
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    endIcon
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    React.ReactNode
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    undefined
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Element placed after the button text
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    onClick
                  </td>
                  <td className="border border-gray-300 px-4 py-2">function</td>
                  <td className="border border-gray-300 px-4 py-2">
                    undefined
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Callback fired when the button is clicked
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    shadowConfig
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    DynamicShadowConfig
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    undefined
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Configuration for dynamic shadow effects
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    bevelConfig
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    BevelConfig
                  </td>
                  <td className="border border-gray-300 px-4 py-2">auto</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Custom configuration for beveled corners
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono">
                    stepsConfig
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    StepConfig
                  </td>
                  <td className="border border-gray-300 px-4 py-2">default</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Configuration for stepped/segmented edges
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Examples */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Usage Examples</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Basic Button</h3>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                {`<BeveledButton variant="contained" color="primary">
  Click Me
</BeveledButton>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Button with Icons</h3>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                {`<BeveledButton
  variant="outlined"
  color="secondary"
  startIcon={<SaveIcon />}
  endIcon={<ArrowRightIcon />}
>
  Save and Continue
</BeveledButton>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Loading Button</h3>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                {`<BeveledButton
  variant="contained"
  color="primary"
  loading={isLoading}
  disabled={isLoading}
  onClick={handleSubmit}
>
  {isLoading ? 'Processing...' : 'Submit'}
</BeveledButton>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">
                Custom Shadow Configuration
              </h3>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                {`<BeveledButton
  variant="contained"
  color="primary"
  shadowConfig={{
    target: { type: 'mouse' },
    maxShadowDistance: 20,
    smoothing: 0.8
  }}
>
  Interactive Shadow
</BeveledButton>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
