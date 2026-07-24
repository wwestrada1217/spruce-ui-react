import pkg from '../../package.json';

/** The library version, read from the root package.json at build time. */
export const SPRUCE_VERSION: string = pkg.version;
