import type { LanguageDefinition } from '../tokenizer.js';

const keywords = [
  'ADD', 'ALL', 'ALTER', 'AND', 'ANY', 'AS', 'ASC', 'AUTHORIZATION',
  'BACKUP', 'BEGIN', 'BETWEEN', 'BREAK', 'BROWSE', 'BULK', 'BY',
  'CASCADE', 'CASE', 'CHECK', 'CHECKPOINT', 'CLOSE', 'CLUSTERED',
  'COALESCE', 'COLLATE', 'COLUMN', 'COMMIT', 'COMPUTE', 'CONSTRAINT',
  'CONTAINS', 'CONTINUE', 'CONVERT', 'CREATE', 'CROSS', 'CURRENT',
  'CURSOR', 'DATABASE', 'DBCC', 'DEALLOCATE', 'DECLARE', 'DEFAULT',
  'DELETE', 'DENY', 'DESC', 'DISK', 'DISTINCT', 'DISTRIBUTED', 'DOUBLE',
  'DROP', 'DUMP', 'ELSE', 'END', 'ERRLVL', 'ESCAPE', 'EXCEPT', 'EXEC',
  'EXECUTE', 'EXISTS', 'EXIT', 'EXTERNAL', 'FETCH', 'FILE', 'FILLFACTOR',
  'FOR', 'FOREIGN', 'FREETEXT', 'FROM', 'FULL', 'FUNCTION', 'GOTO',
  'GRANT', 'GROUP', 'HAVING', 'HOLDLOCK', 'IDENTITY', 'IF', 'IN',
  'INDEX', 'INNER', 'INSERT', 'INTERSECT', 'INTO', 'IS', 'JOIN', 'KEY',
  'KILL', 'LEFT', 'LIKE', 'LIMIT', 'LINENO', 'LOAD', 'MERGE',
  'NATIONAL', 'NOCHECK', 'NONCLUSTERED', 'NOT', 'NULL', 'NULLIF', 'OF',
  'OFF', 'OFFSETS', 'ON', 'OPEN', 'OPTION', 'OR', 'ORDER', 'OUTER',
  'OVER', 'PARTITION', 'PERCENT', 'PIVOT', 'PLAN', 'PRECISION', 'PRIMARY',
  'PRINT', 'PROC', 'PROCEDURE', 'PUBLIC', 'RAISERROR', 'READ',
  'RECONFIGURE', 'REFERENCES', 'REPLICATION', 'RESTORE', 'RESTRICT',
  'RETURN', 'REVERT', 'REVOKE', 'RIGHT', 'ROLLBACK', 'ROWCOUNT',
  'ROWGUIDCOL', 'RULE', 'SAVE', 'SCHEMA', 'SELECT', 'SESSION_USER',
  'SET', 'SETUSER', 'SHUTDOWN', 'SOME', 'STATISTICS', 'TABLE',
  'TABLESAMPLE', 'TEXTSIZE', 'THEN', 'TO', 'TOP', 'TRAN', 'TRANSACTION',
  'TRIGGER', 'TRUNCATE', 'UNION', 'UNIQUE', 'UNPIVOT', 'UPDATE',
  'UPDATETEXT', 'USE', 'USER', 'VALUES', 'VARYING', 'VIEW', 'WAITFOR',
  'WHEN', 'WHERE', 'WHILE', 'WITH', 'WRITETEXT',
];

const functions = [
  'AVG', 'COUNT', 'MAX', 'MIN', 'SUM', 'ABS', 'CEILING', 'FLOOR',
  'ROUND', 'CAST', 'COALESCE', 'CONCAT', 'CONVERT', 'DATEADD',
  'DATEDIFF', 'DATENAME', 'DATEPART', 'GETDATE', 'GETUTCDATE',
  'ISNULL', 'LEFT', 'LEN', 'LOWER', 'LTRIM', 'NEWID', 'NULLIF',
  'REPLACE', 'RIGHT', 'ROW_NUMBER', 'RTRIM', 'STUFF', 'SUBSTRING',
  'TRIM', 'UPPER', 'YEAR', 'MONTH', 'DAY', 'RANK', 'DENSE_RANK',
  'NTILE', 'LAG', 'LEAD', 'FIRST_VALUE', 'LAST_VALUE', 'STRING_AGG',
  'IIF', 'FORMAT', 'TRY_CAST', 'TRY_CONVERT', 'JSON_VALUE', 'JSON_QUERY',
];

const types = [
  'INT', 'INTEGER', 'BIGINT', 'SMALLINT', 'TINYINT', 'BIT', 'DECIMAL',
  'NUMERIC', 'MONEY', 'SMALLMONEY', 'FLOAT', 'REAL', 'DATE', 'DATETIME',
  'DATETIME2', 'SMALLDATETIME', 'TIME', 'DATETIMEOFFSET', 'CHAR',
  'VARCHAR', 'TEXT', 'NCHAR', 'NVARCHAR', 'NTEXT', 'BINARY', 'VARBINARY',
  'IMAGE', 'UNIQUEIDENTIFIER', 'XML', 'JSON', 'TABLE', 'CURSOR',
  'HIERARCHYID', 'SQL_VARIANT', 'TIMESTAMP', 'ROWVERSION', 'BOOLEAN',
];

const keywordPattern = new RegExp(`\\b(?:${keywords.join('|')})\\b`, 'giy');
const functionPattern = new RegExp(`\\b(?:${functions.join('|')})\\s*(?=\\()`, 'giy');
const typePattern = new RegExp(`\\b(?:${types.join('|')})\\b`, 'giy');

export const sql: LanguageDefinition = {
  name: 'sql',
  rules: [
    { pattern: /\/\*[\s\S]*?\*\//gy, type: 'comment' },
    { pattern: /--[^\n]*/gy, type: 'comment' },
    { pattern: /'(?:[^']|'')*'/gy, type: 'string' },
    { pattern: /N'(?:[^']|'')*'/giy, type: 'string' },
    { pattern: /\[[\w\s]+\]/gy, type: 'variable' },
    { pattern: /\d+\.?\d*(?:[eE][+-]?\d+)?/gy, type: 'number' },
    { pattern: functionPattern, type: 'function' },
    { pattern: typePattern, type: 'type' },
    { pattern: keywordPattern, type: 'keyword' },
    { pattern: /@@?\w+/gy, type: 'variable' },
    { pattern: /[a-zA-Z_]\w*/gy, type: 'plain' },
    { pattern: /[!=<>]=?|[+\-*/%&|^~]/gy, type: 'operator' },
    { pattern: /[{}()\[\];:,.]/gy, type: 'punctuation' },
  ],
};
