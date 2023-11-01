
const uuid = require('uuid').v4
const { chain } = require('lodash');

const BINGO_SIZE = 75
const BINGO_NUMBERS = Array(BINGO_SIZE).fill(0).map((_, i) => i + 1);

const storage = {}

/**
 * Create a new BINGO game
 * @type { RequestHandler }
 */
module.exports.createBingo = async (req, res) => {
    const id = uuid()
    const numbers = chain(BINGO_NUMBERS).shuffle().value()
    const cards = []

    storage[id] = {
        id,
        numbers,
        cards,
    }

    return res.send(storage[id])
}

/**
 * Generates a new card for the bingo passed as path parameter
 * @type { RequestHandler }
 */
module.exports.generateCard = async (req, res) => {
    const bingoId = res?.locals?.oas?.params?.bingoId

    if (!bingoId) return res.send({ error: 'Bingo ID is required' })
    if (!storage[bingoId]) return res.send({ error: 'Bingo ID is invalid' })

    const COLUMN_LIMITS = [
        [1, 15],
        [16, 30],
        [31, 45],
        [46, 60],
        [61, 75],
    ]

    const bingoNumbers = chain(storage[bingoId].numbers).shuffle().value()
    const TEMPLATE_ROWS = Array(5).fill([])

    const pickRandomNumber = (rowIndex) => {
        return chain(COLUMN_LIMITS)
            .map(([min, max], columnIndex) => {
                if (rowIndex === 2 && columnIndex == 2) { return null }

                // pick number from random array
                const { value, index } = chain(bingoNumbers)
                    .map((value, index) => ({ value, index }))
                    .find(({ value }) => (min <= value && value <= max))
                    .value()

                // remove the picked element
                bingoNumbers.splice(index, 1)

                return value
            })
            .value()
    }

    const card = chain(TEMPLATE_ROWS)
        .map((it, rowIndex) => pickRandomNumber(rowIndex))
        .value()

    storage[bingoId]?.cards.push(card)

    return res.send(card)
}

/**
 * Get a number from the numbers registered on the bingo passed as path parameter
 * @type { RequestHandler }
 */
module.exports.getNumber = async (req, res) => {
    const bingoId = res?.locals?.oas?.params?.bingoId

    if (!bingoId) return res.send({ error: 'Bingo ID is required' })
    if (!storage[bingoId]) return res.send({ error: 'Bingo ID is invalid' })


    const pickedNumber = storage[bingoId]?.numbers.pop()

    return res.send(pickedNumber)
}

/**
 * Retuns all the bingo information
 * @type { RequestHandler }
 */
module.exports.getBingo = async (req, res) => {
    const bingoId = res?.locals?.oas?.params?.bingoId

    if (!bingoId) return res.send({ error: 'Bingo ID is required' })
    if (!storage[bingoId]) return res.send({ error: 'Bingo ID is invalid' })

    return res.send(storage[bingoId])
}