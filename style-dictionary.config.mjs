import StyleDictionary from 'style-dictionary';

// Flutter has no units: 16px -> 16.0 (the built-in flutter group assumes rem and multiplies by 16)
StyleDictionary.registerTransform({
  name: 'size/pxToFlutterDouble',
  type: 'value',
  filter: (t) => t.$type === 'dimension',
  transform: (t) => {
    // accepts "16px" (Claude export) or { value: 16, unit: 'px' } (Tokens Studio / DTCG 2025)
    const v = t.$value;
    const n = typeof v === 'object' ? v.value : parseFloat(v);
    return Number(n).toFixed(1);
  },
});

export default {
  source: ['tokens/**/*.tokens.json'],
  platforms: {
    web: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: [{ destination: 'tokens.css', format: 'css/variables',
                filter: (t) => t.$type !== 'typography',
                options: { outputReferences: true } }],
    },
    flutter: {
      transforms: ['attribute/cti', 'name/camel', 'color/hex8flutter', 'size/pxToFlutterDouble'],
      buildPath: 'build/flutter/',
      files: [{ destination: 'tokens.dart', format: 'flutter/class.dart',
                filter: (t) => t.$type !== 'typography',
                options: { className: 'AppTokens' } }],
    },
  },
};
