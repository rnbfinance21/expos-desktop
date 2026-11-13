type KeypadValue = number | 'reset' | 'delete'

type NumericKeypadProps = {
    onPress: (value: KeypadValue) => void
}

const keypadRows: KeypadValue[][] = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
    ['reset', 0, 'delete']
]

const labelByValue: Record<'reset' | 'delete', string> = {
    reset: 'Reset',
    delete: 'Del'
}

function Numpad({ onPress }: NumericKeypadProps) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {keypadRows.flat().map((value) => {
                const label = typeof value === 'number' ? value : labelByValue[value]

                return (
                    <button
                        key={String(value)}
                        type="button"
                        onClick={() => onPress(value)}
                        className="text-xs font-medium py-2 border rounded active:bg-gray-100"
                        // className="h-10 rounded-md border border-[#d2d5d9] bg-[#f4f5f7] text-sm font-semibold text-[#2d2d2d] transition hover:bg-white active:scale-[0.99]"
                    >
                        {label}
                    </button>
                )
            })}
        </div>
    )
}

export type { KeypadValue }

export default Numpad
