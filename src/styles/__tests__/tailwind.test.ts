/** @jest-environment node */
import { execFileSync } from 'child_process';
import { resolve } from 'path';
import postcss, { Root, Rule } from 'postcss';

import { clsxm } from '@/lib/clsxm';

describe('Tailwind styles', () => {
  let css: Root;

  beforeAll(() => {
    // Compile through the real PostCSS configuration in Node, outside Jest's
    // module loader, so Tailwind's native scanner and module resolution run normally.
    const compiled = execFileSync(
      process.execPath,
      [
        '-e',
        `
          const fs = require('fs');
          const postcss = require('postcss');
          const config = require('./postcss.config.js');
          const plugins = Object.entries(config.plugins).map(([name, options]) => require(name)(options));
          const from = require('path').resolve('src/styles/globals.css');
          const source = fs.readFileSync(from, 'utf8') + '@source inline("font-primary bg-bg text-text bg-transparent text-xl text-2xl text-3xl text-4xl text-5xl text-6xl w-100-vw h-40-vw grid-cols-1-3 blur-xs rounded-xs shrink-0 wrap-break-word");';
          postcss(plugins).process(source, { from }).then(result => process.stdout.write(result.css));
        `,
      ],
      { cwd: resolve(__dirname, '../../..'), encoding: 'utf8' },
    );
    css = postcss.parse(compiled);
  });

  function rule(selector: string): Rule {
    let found: Rule | undefined;
    css.walkRules(selector, (node) => {
      found = node;
    });
    if (!found) throw new Error(`Missing generated style: ${selector}`);
    return found;
  }

  function declaration(selector: string, property: string) {
    return rule(selector).nodes.find(
      (node) => node.type === 'decl' && node.prop === property,
    );
  }

  it('resolves theme colors and the page font at the element using them', () => {
    expect(declaration('.bg-bg', 'background-color')).toMatchObject({
      value: 'var(--bg)',
    });
    expect(declaration('.text-text', 'color')).toMatchObject({
      value: 'var(--text)',
    });
    expect(declaration('.font-primary', 'font-family')).toMatchObject({
      value: 'var(--font-bricolage)',
    });
  });

  it('preserves custom heading sizes without introducing fixed line heights', () => {
    for (const [size, value] of Object.entries({
      xl: '1.25rem',
      '2xl': '2rem',
      '3xl': '2.25rem',
      '4xl': '3rem',
      '5xl': '4rem',
      '6xl': '5rem',
    })) {
      expect(declaration(`.text-${size}`, 'font-size')).toMatchObject({
        value,
      });
      expect(declaration(`.text-${size}`, 'line-height')).toBeUndefined();
    }
  });

  it('generates the custom dimensions used for full-width maps and layouts', () => {
    expect(declaration('.w-100-vw', 'width')).toMatchObject({ value: '100vw' });
    expect(declaration('.h-40-vw', 'height')).toMatchObject({ value: '40vw' });
    expect(
      declaration('.grid-cols-1-3', 'grid-template-columns'),
    ).toMatchObject({ value: '33% auto' });
    expect(declaration('.layout', 'max-width')).toMatchObject({
      value: '68.75rem',
    });
  });

  it('allows transparent ghost inputs to override the shared form background', () => {
    let formRule: Rule | undefined;
    css.walkDecls('background-color', (node) => {
      if (node.value === 'var(--form-bg)') formRule = node.parent as Rule;
    });
    expect(formRule?.selector).toContain('textarea');
    expect(formRule?.parent).toMatchObject({
      name: 'layer',
      params: 'components',
    });
    expect(rule('.bg-transparent').parent).toMatchObject({
      name: 'layer',
      params: 'utilities',
    });
    expect(declaration('.bg-transparent', 'background-color')).toMatchObject({
      value: 'transparent',
    });
  });

  it('generates the renamed loading, timeline and wrapping utilities', () => {
    expect(declaration('.blur-xs', '--tw-blur')).toMatchObject({
      value: 'blur(var(--blur-xs))',
    });
    expect(declaration('.rounded-xs', 'border-radius')).toMatchObject({
      value: 'var(--radius-xs)',
    });
    expect(declaration('.shrink-0', 'flex-shrink')).toMatchObject({
      value: '0',
    });
    expect(declaration('.wrap-break-word', 'overflow-wrap')).toMatchObject({
      value: 'break-word',
    });
  });

  it('merges Tailwind 4 utilities and preserves independent text properties', () => {
    expect(clsxm('size-8', 'size-10')).toBe('size-10');
    expect(clsxm('p-2!', 'p-4!')).toBe('p-4!');
    expect(clsxm('text-2xl text-text', 'text-3xl')).toBe('text-text text-3xl');
    expect(clsxm('bg-bg', 'bg-transparent')).toBe('bg-transparent');
  });
});
