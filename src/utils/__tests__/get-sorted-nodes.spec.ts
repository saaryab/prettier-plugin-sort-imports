import { parse as babelParser, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { ImportDeclaration, isTSModuleDeclaration } from '@babel/types';
import { getSortedNodes } from '../get-sorted-nodes';

const code = `// first comment
// second comment
import z from 'z';
import c from 'c';
import g from 'g';
import t from 't';
import k from 'k';
import a from 'a';
import BY from 'BY';
import Ba from 'Ba';
import XY from 'XY';
import Xa from 'Xa';
`;

const getImportNodes = (code: string, options?: ParserOptions) => {
    const importNodes: ImportDeclaration[] = [];
    const ast = babelParser(code, {
        ...options,
        sourceType: 'module',
    });

    traverse(ast, {
        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            const tsModuleParent = path.findParent((p) =>
                isTSModuleDeclaration(p),
            );
            if (!tsModuleParent) {
                importNodes.push(path.node);
            }
        },
    });

    return importNodes;
};

const getSortedNodesNames = (imports: ImportDeclaration[]) =>
    imports
        .filter((i) => i.type === 'ImportDeclaration')
        .map((i) => i.source.value); // TODO: get from specifier

test('it returns all sorted nodes', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, [], false, false) as ImportDeclaration[];
    expect(sorted).toMatchSnapshot();
    expect(getSortedNodesNames(sorted)).toEqual(['BY', 'Ba', 'XY', 'Xa', 'a', 'c', 'g', 'k', 't', 'z']);
});

test('it returns all sorted nodes case-insensitive', () => {
  const result = getImportNodes(code);
  const sorted = getSortedNodes(result, [], false, true) as ImportDeclaration[];
  expect(sorted).toMatchSnapshot();
  expect(getSortedNodesNames(sorted)).toEqual(['a', 'Ba', 'BY', 'c', 'g', 'k', 't', 'Xa', 'XY', 'z']);
});

test('it returns all sorted nodes with sort order', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(
        result,
        ['^a$', '^t$', '^k$', '^B'],
        true,
        false,
    ) as ImportDeclaration[];
    expect(sorted).toMatchSnapshot();
    expect(getSortedNodesNames(sorted)).toEqual(['XY', 'Xa', 'c', 'g', 'z', 'a', 't', 'k', 'BY', 'Ba']);
});

test('it returns all sorted nodes with sort order case-insensitive', () => {
  const result = getImportNodes(code);
  const sorted = getSortedNodes(
      result,
      ['^a$', '^t$', '^k$', '^B'],
      true,
      true,
  ) as ImportDeclaration[];
  expect(sorted).toMatchSnapshot();
  expect(getSortedNodesNames(sorted)).toEqual(['c', 'g', 'Xa', 'XY', 'z', 'a', 't', 'k', 'Ba', 'BY']);
});
