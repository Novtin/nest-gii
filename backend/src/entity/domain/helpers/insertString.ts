export function insertString(str: string, subStr: string, position: number) {
    return str.slice(0, position) + subStr + str.slice(position);
}
