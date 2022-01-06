export interface Module {
  name: string;
  /**
   * Cannot have spaces
   */
  codeName: string;
  path?: string;
  type: ModuleType;
  /**
   * Typically a noun, sometimes phrased with "How to..."
   *
   * @example // The algorithm to solve a system of first order ODEs.
   */
  secrets: string;
  /**
   * Services/responsibilities a module provides
   *
   * @example
   * // Provides solvers that take the governing equation, initial
   * // conditions, and numerical parameters, and solve them.
   */
  services: string;
  implementedBy: string;
  associatedRequirements: string[];
  uses: Module[];
  contents: string | ModuleContents;
}

export interface ModuleContents {
  syntax: {
    exportedConstants?: Variable[];
    exportedTypes?: Type[];
    exportedAccessPrograms?: AccessProgram[];
  };
  semantics: {
    stateVariables?: Variable[];
    stateInvariants?: string[];
    assumptions?: string[];
  };
}

export enum ModuleType {
  HARDWARE_HIDING = "Hardware Hiding",
  BEHAVIOUR_HIDING = "Behaviour Hiding",
  SOFTWARE_DECISION = "Software Decision",
}

export type Type =
  | string
  | SimpleType
  | OrType
  | UnionType
  | SetType
  | SequenceType
  | TupleType
  | ExternalType;

interface BaseType {
  name?: string;
  kind: TypeKind;
}
interface SimpleType extends BaseType {
  kind: TypeKind.SIMPLE;
  description: string;
}

interface OrType extends BaseType {
  kind: TypeKind.OR;
  types: Type[];
}

interface UnionType extends BaseType {
  kind: TypeKind.UNION;
  types: Type[];
}

interface SetType extends BaseType {
  kind: TypeKind.SET;
  values: Set<Type>;
}
interface SequenceType extends BaseType {
  kind: TypeKind.SEQUENCE;
  type: Type;
}
interface TupleType extends BaseType {
  kind: TypeKind.TUPLE;
  values: Record<string, Type>;
}

interface ExternalType extends BaseType {
  kind: TypeKind.EXTERNAL;
  /** Either a LaTeX reference or an external URL */
  customRef: string | URL;
}

export enum TypeKind {
  SIMPLE,
  EXTERNAL,
  SET,
  SEQUENCE,
  TUPLE,
  OR,
  UNION,
}

export interface Variable {
  name: string;
  type: Type;
  description?: string;
  defaultValue?: string;
}

export interface AccessProgram {
  name: string;
  in: Record<string, Type>;
  out?: Type | Type[];
  exceptions?: string[];
  semantics: string[];
}
