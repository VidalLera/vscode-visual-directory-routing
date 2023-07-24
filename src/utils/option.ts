export type None = null | undefined;
type OptionType <T> = T extends None ? null : T;

export class Option <T> {

  private constructor (
    private readonly value?: OptionType<T>
  ) {}

  static ofNulleable = <T> (value: OptionType<T>): Option<T> => new Option(value);

  static some = <T> (
    value: T extends None ? never : T
  ): Option<T> => new Option(value);

  static none = <T> (): Option<T> => new Option<T>();
  
  unWrapOr (defaultValue: T) {
    return this.value ? this.value : defaultValue;
  }

  unWrapOrElse (callback: () => T) {
    this.value ? this.value : callback();
  }

  match <U> (
    ifSome: (some: T) => U,
    ifNone: () => U
  ): U {
    return this.value ? ifSome(this.value) : ifNone();
  }
}