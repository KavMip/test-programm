const dataset = require('./example.in.json')
const fs = require("fs")

const DIFFERENT = 'different'
const SYNONYMS = 'synonyms'
const OUTPUT_FILENAME = 'output-main.txt'

const output = {
    filename: OUTPUT_FILENAME,
    clearFile() {
        fs.writeFileSync(this.filename, '')
    },
    append(text) {
        fs.appendFileSync(this.filename, text + '\n')
    }
}

const memoizer = (fun) => {
    let cache = {}
    return function (a, b, ...rest) {
        const key = a + '-' + b
        if (cache[key] !== undefined) {
            return cache[key]
        }
        let result = fun(a, b, ...rest)
        cache[key] = result
        return result

    }
}

const parseDictionary = (dictionary) => {
    return dictionary.reduce((acc, cur) => {
        const word1 = cur[0].toLowerCase()
        const word2 = cur[1].toLowerCase()
        const w1 = acc[word1] ? [...acc[word1], word2] : [word2]
        const w2 = acc[word2] ? [...acc[word2], word1] : [word1]
        return {...acc, [word1]: w1, [word2]: w2}
    }, {})
}

const checkTestCase = (testCase) => {
    const dictionary = parseDictionary(testCase.dictionary)
    const findSynonyms = memoizer((word1, word2, dictionary, checkedWords = []) => {
        if (word1 === word2) return true
        if (!dictionary[word1] || !dictionary[word2]) return false
        if (dictionary[word1].some(w => w === word2)) return true
        if (dictionary[word1]) {
            return dictionary[word1].filter(w => !checkedWords.some(cw => cw === w)).some(w => {
                return findSynonyms(w, word2, dictionary, [...checkedWords, word1])
            })
        }
        return false
    })

    for (const query of testCase.queries) {
        const word1 = query[0].toLowerCase()
        const word2 = query[1].toLowerCase()

        // console.log(word1,word2,dictionary)
        output.append(findSynonyms(word1, word2, dictionary) ? SYNONYMS : DIFFERENT)
    }
}


const main = () => {
    output.clearFile()

    for (const testCase of dataset.testCases) {
        checkTestCase(testCase)
    }
}

main()
console.log('✅ Complete!')