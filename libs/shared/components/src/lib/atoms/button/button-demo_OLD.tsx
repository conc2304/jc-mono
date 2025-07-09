// 'use client';
// import React, { ReactNode, useState } from 'react';
// import { CSSProperties } from '@mui/material';

// import { AugmentedButton } from './button';

// // Layout components using CSS-in-JS
// const DemoSection = ({
//   title,
//   children,
// }: {
//   title: string;
//   children: ReactNode;
// }) => {
//   const sectionStyles: CSSProperties = {
//     marginBottom: '64px',
//     padding: '32px',
//     background: 'rgba(0, 68, 136, 0.1)',
//     border: '2px solid #00ffff',
//     position: 'relative',
//     clipPath:
//       'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
//   };

//   const titleStyles: CSSProperties = {
//     fontSize: '1.875rem',
//     fontWeight: 'bold',
//     color: '#ff6600',
//     textTransform: 'uppercase',
//     letterSpacing: '2px',
//     marginBottom: '24px',
//     fontFamily: '"Courier New", monospace',
//   };

//   return (
//     <div style={sectionStyles}>
//       <h2 style={titleStyles}>{title}</h2>
//       {children}
//     </div>
//   );
// };

// const ButtonShowcase = ({ button, label }) => {
//   const showcaseStyles: CSSProperties = {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     gap: '16px',
//   };

//   const labelStyles: CSSProperties = {
//     fontSize: '14px',
//     color: '#cccccc',
//     textAlign: 'center',
//     fontFamily: '"Courier New", monospace',
//   };

//   return (
//     <div style={showcaseStyles}>
//       {button}
//       <p style={labelStyles}>{label}</p>
//     </div>
//   );
// };

// const GridContainer = ({ children, columns = 4 }) => {
//   const gridStyles = {
//     display: 'grid',
//     gridTemplateColumns: `repeat(${columns}, 1fr)`,
//     gap: '32px',
//     '@media (max-width: 1024px)': {
//       gridTemplateColumns: 'repeat(2, 1fr)',
//     },
//     '@media (max-width: 640px)': {
//       gridTemplateColumns: '1fr',
//     },
//   };

//   // Responsive grid using CSS media queries
//   React.useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       .responsive-grid {
//         display: grid;
//         grid-template-columns: repeat(${columns}, 1fr);
//         gap: 32px;
//       }

//       @media (max-width: 1024px) {
//         .responsive-grid {
//           grid-template-columns: repeat(2, 1fr);
//         }
//       }

//       @media (max-width: 640px) {
//         .responsive-grid {
//           grid-template-columns: 1fr;
//         }
//       }
//     `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//     };
//   }, [columns]);

//   return <div className="responsive-grid">{children}</div>;
// };

// export const ButtonDemo = () => {
//   const [demoConfig, setDemoConfig] = useState({
//     variant: 'primary',
//     size: 'medium',
//     cornerStyle: 'tl-clip tr-clip bl-clip br-clip',
//     effect: 'none',
//   });

//   const handleConfigChange = (field, value) => {
//     setDemoConfig((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const generateCode = () => {
//     const { variant, size, cornerStyle, effect } = demoConfig;
//     const sizeStr = size !== 'medium' ? ` size="${size}"` : '';
//     const effectStr = effect !== 'none' ? ` effect="${effect}"` : '';

//     return `
//     <AugmentedButton
//       variant="${variant}"${sizeStr}${effectStr}
//       data-augmented-ui="${cornerStyle} border"
//     >
//       Custom Button
//     </AugmentedButton>`;
//   };

//   // Load augmented-ui CSS
//   React.useEffect(() => {
//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href =
//       'https://cdnjs.cloudflare.com/ajax/libs/augmented-ui/2.0.0/augmented-ui.min.css';
//     document.head.appendChild(link);

//     return () => {
//       if (document.head.contains(link)) {
//         document.head.removeChild(link);
//       }
//     };
//   }, []);

//   const containerStyles: CSSProperties = {
//     minHeight: '100vh',
//     color: '#ffffff',
//     fontFamily: '"Courier New", monospace',
//     background:
//       'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
//   };

//   const mainContentStyles: CSSProperties = {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     padding: '40px 20px',
//   };

//   const headerStyles: CSSProperties = {
//     textAlign: 'center',
//     marginBottom: '48px',
//   };

//   const titleStyles: CSSProperties = {
//     fontSize: '3.75rem',
//     fontWeight: 'bold',
//     color: '#00ffff',
//     textTransform: 'uppercase',
//     letterSpacing: '3px',
//     marginBottom: '24px',
//     textShadow: '0 0 20px #00ffff',
//   };

//   const subtitleStyles: CSSProperties = {
//     fontSize: '1.25rem',
//     color: '#cccccc',
//     marginBottom: '32px',
//     fontFamily: '"Courier New", monospace',
//   };

//   const interactiveDemoStyles: CSSProperties = {
//     background: 'rgba(0, 17, 34, 0.3)',
//     border: '1px solid #00ffff',
//     padding: '32px',
//     position: 'relative',
//     clipPath:
//       'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
//   };

//   const controlsGridStyles: CSSProperties = {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(4, 1fr)',
//     gap: '24px',
//     marginBottom: '32px',
//   };

//   const controlGroupStyles: CSSProperties = {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//   };

//   const labelStyles: CSSProperties = {
//     color: '#00ffff',
//     fontSize: '14px',
//     fontFamily: '"Courier New", monospace',
//     textTransform: 'uppercase',
//   };

//   const selectStyles: CSSProperties = {
//     width: '100%',
//     background: 'rgba(0, 68, 136, 0.8)',
//     border: '1px solid #00ffff',
//     color: '#ffffff',
//     fontFamily: '"Courier New", monospace',
//     padding: '12px',
//     fontSize: '14px',
//     clipPath:
//       'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
//   };

//   const demoResultStyles: CSSProperties = {
//     textAlign: 'center',
//     padding: '32px',
//     background: 'rgba(0, 0, 0, 0.3)',
//     border: '1px solid #666666',
//     marginBottom: '24px',
//     clipPath:
//       'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
//   };

//   const codeBlockStyles: CSSProperties = {
//     background: 'rgba(0, 0, 0, 0.5)',
//     border: '1px solid #666666',
//     padding: '24px',
//     fontFamily: '"Courier New", monospace',
//     fontSize: '12px',
//     color: '#cccccc',
//     overflowX: 'auto',
//     clipPath:
//       'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
//   };

//   // Add responsive CSS for controls grid
//   React.useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       .controls-grid {
//         display: grid;
//         grid-template-columns: repeat(4, 1fr);
//         gap: 24px;
//         margin-bottom: 32px;
//       }

//       @media (max-width: 1024px) {
//         .controls-grid {
//           grid-template-columns: repeat(2, 1fr);
//         }
//       }

//       @media (max-width: 640px) {
//         .controls-grid {
//           grid-template-columns: 1fr;
//         }
//       }

//       @media (max-width: 768px) {
//         .demo-title {
//           font-size: 2rem !important;
//         }
//       }
//     `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   return (
//     <div style={containerStyles}>
//       <div style={mainContentStyles}>
//         {/* Header */}
//         <div style={headerStyles}>
//           <h1 style={titleStyles} className="demo-title">
//             Augmented Button
//           </h1>
//           <p style={subtitleStyles}>
//             Cyberpunk-styled buttons with Material UI functionality
//           </p>
//         </div>

//         {/* Basic Variants */}
//         <DemoSection title="Color Variants">
//           <GridContainer columns={4}>
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="primary"
//                   data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
//                 >
//                   Primary
//                 </AugmentedButton>
//               }
//               label="Primary Button"
//             />
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   variant="secondary"
//                   data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
//                 >
//                   Secondary
//                 </AugmentedButton>
//               }
//               label="Secondary Button"
//             />
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   variant="error"
//                   data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
//                 >
//                   Danger
//                 </AugmentedButton>
//               }
//               label="Danger Button"
//             />
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="success"
//                   data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
//                 >
//                   Success
//                 </AugmentedButton>
//               }
//               label="Success Button"
//             />
//           </GridContainer>
//         </DemoSection>

//         {/* Shape colors */}
//         <DemoSection title="Shape colors">
//           <GridContainer columns={4}>
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="primary"
//                   data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
//                 >
//                   Standard Clips
//                 </AugmentedButton>
//               }
//               label="All Corners Clipped"
//             />
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="primary"
//                   data-augmented-ui="tl-round tr-clip bl-clip br-round border"
//                 >
//                   Mixed Corners
//                 </AugmentedButton>
//               }
//               label="Round + Clip Mix"
//             />
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="primary"
//                   data-augmented-ui="tl-clip-x tr-clip-x bl-clip-x br-clip-x border"
//                 >
//                   Extended Clips
//                 </AugmentedButton>
//               }
//               label="Extended Clips"
//             />
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="primary"
//                   data-augmented-ui="tl-round tr-round bl-round br-round border"
//                 >
//                   All Rounded
//                 </AugmentedButton>
//               }
//               label="All Rounded"
//             />
//           </GridContainer>
//         </DemoSection>

//         {/* Size Variants */}
//         <DemoSection title="Size Variants">
//           <GridContainer columns={3}>
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="primary"
//                   size="small"
//                   data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
//                 >
//                   Small
//                 </AugmentedButton>
//               }
//               label="Small Button"
//             />
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="primary"
//                   data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
//                 >
//                   Medium
//                 </AugmentedButton>
//               }
//               label="Medium Button"
//             />
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="primary"
//                   size="large"
//                   data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
//                 >
//                   Large
//                 </AugmentedButton>
//               }
//               label="Large Button"
//             />
//           </GridContainer>
//         </DemoSection>

//         {/* Special Effects */}
//         <DemoSection title="Special Effects">
//           <GridContainer columns={3}>
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="primary"
//                   effect="glitch"
//                   data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
//                 >
//                   Glitch Effect
//                 </AugmentedButton>
//               }
//               label="Glitch Animation"
//             />
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="primary"
//                   effect="pulse"
//                   data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
//                 >
//                   Pulse Effect
//                 </AugmentedButton>
//               }
//               label="Pulse Animation"
//             />
//             <ButtonShowcase
//               button={
//                 <AugmentedButton
//                   color="primary"
//                   disabled
//                   data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
//                 >
//                   Disabled
//                 </AugmentedButton>
//               }
//               label="Disabled State"
//             />
//           </GridContainer>
//         </DemoSection>

//         {/* Interactive Demo */}
//         <div style={interactiveDemoStyles}>
//           <h2
//             style={{
//               fontSize: '1.875rem',
//               fontWeight: 'bold',
//               color: '#ff6600',
//               textTransform: 'uppercase',
//               letterSpacing: '2px',
//               marginBottom: '24px',
//               fontFamily: '"Courier New", monospace',
//             }}
//           >
//             Interactive Demo
//           </h2>

//           <div className="controls-grid">
//             <div style={controlGroupStyles}>
//               <label style={labelStyles}>Color Variant</label>
//               <select
//                 style={selectStyles}
//                 value={demoConfig.variant}
//                 onChange={(e) => handleConfigChange('variant', e.target.value)}
//               >
//                 <option value="primary">Primary</option>
//                 <option value="secondary">Secondary</option>
//                 <option value="error">Danger</option>
//                 <option value="success">Success</option>
//               </select>
//             </div>

//             <div style={controlGroupStyles}>
//               <label style={labelStyles}>Size</label>
//               <select
//                 style={selectStyles}
//                 value={demoConfig.size}
//                 onChange={(e) => handleConfigChange('size', e.target.value)}
//               >
//                 <option value="small">Small</option>
//                 <option value="medium">Medium</option>
//                 <option value="large">Large</option>
//               </select>
//             </div>

//             <div style={controlGroupStyles}>
//               <label style={labelStyles}>Corner Style</label>
//               <select
//                 style={selectStyles}
//                 value={demoConfig.cornerStyle}
//                 onChange={(e) =>
//                   handleConfigChange('cornerStyle', e.target.value)
//                 }
//               >
//                 <option value="tl-clip tr-clip bl-clip br-clip">
//                   All Clip
//                 </option>
//                 <option value="tl-round tr-clip bl-clip br-round">Mixed</option>
//                 <option value="tl-clip-x tr-clip-x bl-clip-x br-clip-x">
//                   Extended Clip
//                 </option>
//                 <option value="tl-round tr-round bl-round br-round">
//                   All Round
//                 </option>
//               </select>
//             </div>

//             <div style={controlGroupStyles}>
//               <label style={labelStyles}>Effect</label>
//               <select
//                 style={selectStyles}
//                 value={demoConfig.effect}
//                 onChange={(e) => handleConfigChange('effect', e.target.value)}
//               >
//                 <option value="none">None</option>
//                 <option value="glitch">Glitch</option>
//                 <option value="pulse">Pulse</option>
//               </select>
//             </div>
//           </div>

//           <div style={demoResultStyles}>
//             <AugmentedButton
//               color={demoConfig.variant}
//               size={demoConfig.size}
//               effect={demoConfig.effect}
//               data-augmented-ui={`${demoConfig.cornerStyle} border`}
//               onClick={() => {
//                 console.log('Button clicked!');
//               }}
//             >
//               Custom Button
//             </AugmentedButton>
//           </div>

//           <div style={codeBlockStyles}>
//             <div style={{ color: '#cccccc', marginBottom: '8px' }}>
//               React Component:
//             </div>
//             <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
//               <span style={{ color: '#00ffff' }}>{generateCode()}</span>
//             </pre>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
