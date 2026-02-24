export type FormFieldType = {
    name: string,
    id: string,
    element: HTMLInputElement | null,
    span: HTMLElement | null,
    regex: RegExp,
    valid: boolean,
}