// Lightweight syntax tokenizer for CodeBeat practice snippets.

export type TokenType =
  | 'keyword' | 'string' | 'function' | 'comment' | 'number'
  | 'builtin' | 'operator' | 'punct' | 'plain'

export type Token = {
  type: TokenType
  text: string
}

export type CharToken = {
  ch: string
  type: TokenType
  idx: number
}

export type LineData = CharToken[]

type LanguageId = 'python' | 'js' | 'java' | 'c' | 'sql'

type LanguageDefinition = {
  lineComments: string[]
  keywords: Set<string>
  builtins: Set<string>
  caseInsensitive?: boolean
  hashKeyword?: boolean
}

const LANGUAGE_DEFINITIONS: Record<LanguageId, LanguageDefinition> = {
  python: {
    lineComments: ['#'],
    keywords: new Set([
      'def', 'for', 'in', 'if', 'else', 'elif', 'return', 'while', 'class',
      'import', 'from', 'as', 'with', 'try', 'except', 'finally', 'lambda',
      'yield', 'pass', 'break', 'continue', 'and', 'or', 'not', 'is',
      'None', 'True', 'False', 'global', 'nonlocal',
    ]),
    builtins: new Set([
      'print', 'range', 'len', 'str', 'int', 'float', 'list', 'dict', 'tuple',
      'set', 'input', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'reversed',
      'sum', 'min', 'max', 'abs', 'type', 'open', 'round',
    ]),
  },
  js: {
    lineComments: ['//'],
    keywords: new Set([
      'const', 'let', 'var', 'function', 'return', 'for', 'while', 'if', 'else',
      'class', 'new', 'this', 'import', 'export', 'from', 'default', 'try',
      'catch', 'finally', 'throw', 'typeof', 'instanceof', 'of', 'in', 'do',
      'switch', 'case', 'break', 'continue', 'await', 'async', 'null',
      'undefined', 'true', 'false',
    ]),
    builtins: new Set(['console', 'Math', 'Object', 'Array', 'JSON', 'Promise', 'Number', 'String', 'Boolean']),
  },
  java: {
    lineComments: ['//'],
    keywords: new Set([
      'public', 'private', 'protected', 'static', 'final', 'void', 'class',
      'interface', 'extends', 'implements', 'new', 'return', 'if', 'else',
      'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try',
      'catch', 'finally', 'throw', 'throws', 'import', 'package', 'this',
      'super', 'null', 'true', 'false', 'abstract', 'enum',
    ]),
    builtins: new Set(['int', 'long', 'double', 'float', 'char', 'boolean', 'String', 'System', 'Integer', 'List', 'Map']),
  },
  c: {
    lineComments: ['//'],
    hashKeyword: true,
    keywords: new Set([
      'int', 'char', 'float', 'double', 'void', 'long', 'short', 'unsigned',
      'signed', 'struct', 'union', 'enum', 'typedef', 'const', 'static',
      'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
      'break', 'continue', 'sizeof', 'goto', 'default', 'extern',
    ]),
    builtins: new Set(['printf', 'scanf', 'malloc', 'free', 'strlen', 'strcpy', 'NULL']),
  },
  sql: {
    lineComments: ['--'],
    caseInsensitive: true,
    keywords: new Set([
      'select', 'from', 'where', 'group', 'by', 'having', 'order', 'limit',
      'as', 'join', 'left', 'right', 'inner', 'outer', 'on', 'and', 'or',
      'not', 'in', 'is', 'null', 'distinct', 'insert', 'into', 'values',
      'update', 'set', 'delete', 'create', 'table', 'primary', 'key',
      'desc', 'asc', 'between', 'like', 'case', 'when', 'then', 'end',
    ]),
    builtins: new Set(['sum', 'avg', 'count', 'min', 'max', 'round', 'coalesce']),
  },
}

const getLanguageDefinition = (language: string): LanguageDefinition =>
  LANGUAGE_DEFINITIONS[(language as LanguageId) in LANGUAGE_DEFINITIONS ? language as LanguageId : 'python']

export function tokenize(code: string, language: string = 'python'): Token[] {
  const definition = getLanguageDefinition(language)
  const tokens: Token[] = []
  let i = 0

  while (i < code.length) {
    const c = code[i]

    // newline
    if (c === '\n') {
      tokens.push({ type: 'plain', text: '\n' })
      i++
      continue
    }

    // whitespace (non-newline)
    if (c === ' ' || c === '\t') {
      let j = i
      while (j < code.length && (code[j] === ' ' || code[j] === '\t')) j++
      tokens.push({ type: 'plain', text: code.slice(i, j) })
      i = j
      continue
    }

    if (definition.hashKeyword && c === '#') {
      let j = i
      while (j < code.length && /[#A-Za-z_]/.test(code[j])) j++
      tokens.push({ type: 'keyword', text: code.slice(i, j) })
      i = j
      continue
    }

    const lineComment = definition.lineComments.find(comment => code.startsWith(comment, i))
    if (lineComment) {
      let j = i
      while (j < code.length && code[j] !== '\n') j++
      tokens.push({ type: 'comment', text: code.slice(i, j) })
      i = j
      continue
    }

    // string
    if (c === '"' || c === "'" || c === '`') {
      const quote = c
      let j = i + 1
      while (j < code.length && code[j] !== quote) {
        if (code[j] === '\\' && j + 1 < code.length) j++
        j++
      }
      j = Math.min(j + 1, code.length)
      tokens.push({ type: 'string', text: code.slice(i, j) })
      i = j
      continue
    }

    // number
    if (/[0-9]/.test(c)) {
      let j = i
      while (j < code.length && /[0-9.]/.test(code[j])) j++
      tokens.push({ type: 'number', text: code.slice(i, j) })
      i = j
      continue
    }

    // identifier
    if (/[A-Za-z_]/.test(c)) {
      let j = i
      while (j < code.length && /[A-Za-z0-9_]/.test(code[j])) j++
      const word = code.slice(i, j)
      let type: TokenType = 'plain'

      const probe = definition.caseInsensitive ? word.toLowerCase() : word

      if (definition.keywords.has(probe)) {
        type = 'keyword'
      } else if (definition.builtins.has(probe)) {
        type = 'builtin'
      } else if (code[j] === '(') {
        type = 'function'
      }

      tokens.push({ type, text: word })
      i = j
      continue
    }

    // operator
    if (/[+\-*/%=<>!&|^~]/.test(c)) {
      let j = i
      while (j < code.length && /[+\-*/%=<>!&|^~]/.test(code[j])) j++
      tokens.push({ type: 'operator', text: code.slice(i, j) })
      i = j
      continue
    }

    // punctuation
    if (/[(){}\[\],:;.@]/.test(c)) {
      tokens.push({ type: 'punct', text: c })
      i++
      continue
    }

    // fallback
    tokens.push({ type: 'plain', text: c })
    i++
  }

  return tokens
}

export function flatten(tokens: Token[]): CharToken[] {
  const chars: CharToken[] = []
  let idx = 0

  for (const token of tokens) {
    for (const ch of token.text) {
      chars.push({ ch, type: token.type, idx })
      idx++
    }
  }

  return chars
}

export function groupLines(chars: CharToken[]): LineData[] {
  const lines: LineData[] = []
  let currentLine: CharToken[] = []

  chars.forEach((char, i) => {
    currentLine.push({ ...char, idx: i })
    if (char.ch === '\n') {
      lines.push(currentLine)
      currentLine = []
    }
  })

  if (currentLine.length > 0) {
    lines.push(currentLine)
  }

  return lines
}

export function lineForPos(lines: LineData[], pos: number): number {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.length) continue

    const first = line[0].idx
    const last = line[line.length - 1].idx

    if (pos >= first && pos <= last) return i
  }

  return Math.max(0, lines.length - 1)
}

export function isLineStart(chars: CharToken[], pos: number): boolean {
  if (pos === 0) return false
  return chars[pos - 1] && chars[pos - 1].ch === '\n'
}

export function skipIndent(chars: CharToken[], pos: number): number {
  let p = pos
  while (p < chars.length && chars[p].ch === ' ') p++
  return p
}
