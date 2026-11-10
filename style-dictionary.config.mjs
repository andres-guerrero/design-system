import StyleDictionary from 'style-dictionary';

// ---- Flutter value transforms -------------------------------------------
// Sizes: Flutter has no units, 16px -> 16.0
// (accepts "16px" or { value: 16, unit: "px" })
StyleDictionary.registerTransform({
  name: 'size/pxToFlutterDouble',
  type: 'value',
  filter: (t) => t.$type === 'dimension',
  transform: (t) => {
    const v = t.$value;
    const n = typeof v === 'object' ? v.value : parseFloat(v);
    return Number(n).toFixed(1);
  },
});
// Font family: Inter -> 'Inter' (a Dart string)
StyleDictionary.registerTransform({
  name: 'fontFamily/flutter',
  type: 'value',
  filter: (t) => t.$type === 'fontFamily',
  transform: (t) => `'${t.$value}'`,
});
// Font weight: 500 -> FontWeight.w500
StyleDictionary.registerTransform({
  name: 'fontWeight/flutter',
  type: 'value',
  filter: (t) => t.$type === 'fontWeight',
  transform: (t) => `FontWeight.w${t.$value}`,
});

// ---- Flutter format: one TextStyle per Figma text style -------------------
const camel = (ref) => ref.replace(/[{}]/g, '').split(/[.\-]/)
  .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1))).join('');
StyleDictionary.registerFormat({
  name: 'flutter/text-styles',
  format: ({ dictionary, options }) => {
    const styles = {};
    for (const t of dictionary.allTokens.filter((t) => t.path[0] === 'typography')) {
      (styles[t.path[1]] ??= {})[t.path[2]] = camel(t.original.$value);
    }
    const tokens = options.tokensClass ?? 'AppTokens';
    const body = Object.entries(styles).map(([name, p]) => {
      const id = camel(name);
      return `  static const ${id} = TextStyle(\n` +
        `    fontFamily: ${tokens}.${p.fontFamily},\n` +
        `    fontSize: ${tokens}.${p.fontSize},\n` +
        `    fontWeight: ${tokens}.${p.fontWeight},\n` +
        `    height: ${tokens}.${p.lineHeight} / ${tokens}.${p.fontSize}, // Flutter line height is a multiplier\n` +
        `    letterSpacing: ${tokens}.${p.letterSpacing},\n  );`;
    }).join('\n\n');
    return `// Do not edit directly, this file was auto-generated.\n\n` +
      `import 'package:flutter/painting.dart';\nimport 'tokens.dart';\n\n` +
      `class ${options.className ?? 'AppTextStyles'} {\n  ${options.className ?? 'AppTextStyles'}._();\n\n${body}\n}\n`;
  },
});

// ---- Config ---------------------------------------------------------------
export default {
  source: ['tokens/**/*.tokens.json'],
  // Typography tokens are composites (family + weight + size + line-height + letter-spacing).
  // "expand" splits each one into individual tokens that keep their references.
  expand: { include: ['typography'] },
  platforms: {
    web: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: [{ destination: 'tokens.css', format: 'css/variables',
                options: { outputReferences: true } }],   // keeps var(--...) aliases
    },
    flutter: {
      transforms: ['attribute/cti', 'name/camel', 'color/hex8flutter',
                   'size/pxToFlutterDouble', 'fontFamily/flutter', 'fontWeight/flutter'],
      buildPath: 'build/flutter/',
      files: [
        { destination: 'tokens.dart', format: 'flutter/class.dart',
          filter: (t) => t.path[0] !== 'typography',      // text styles go in their own file
          options: { className: 'AppTokens' } },
        { destination: 'text_styles.dart', format: 'flutter/text-styles',
          filter: (t) => t.path[0] === 'typography',
          options: { className: 'AppTextStyles', tokensClass: 'AppTokens' } },
      ],
    },
  },
};
