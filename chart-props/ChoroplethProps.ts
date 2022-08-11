export interface ChoroplethProps {
    data?: {
        name?: string,
        label?: string,
        data?: number
    }[],
    width?: number,
    height?: number
}