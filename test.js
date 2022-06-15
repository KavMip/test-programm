const dataset = require('./example.in.json')
const fs = require("fs")

const DIFFERENT = 'different'
const SYNONYMS = 'synonyms'
const OUTPUT_FILENAME = 'output-test.txt'

const output = {
    filename: OUTPUT_FILENAME,
    clearFile() {
        fs.writeFileSync(this.filename, '')
    },
    append(text) {
        fs.appendFileSync(this.filename, text + '\n')
    }
}

const parseDictionary = (dictionary) => {
    return dictionary.reduce((acc, cur) => {
        const word1 = cur[0].toLowerCase()
        const word2 = cur[1].toLowerCase()

        let w1Set = acc[word1] || new Set();
        let w2Set = acc[word2] || new Set();

        let setMax = w1Set.size > w2Set.size ? w1Set : w2Set;
        let setMin = w1Set.size > w2Set.size ? w2Set : w1Set;

        for (let a of setMin.values()) {
            setMax.add(a);
        }

        setMax.add(word1);
        setMax.add(word2);

        acc[word1] = setMax;
        acc[word2] = setMax;
        for (let a of setMin.values()) {
            acc[a] = setMax;
        }

        return acc;
    }, {})
}

const findSynonyms = (word1, word2, dictionary = []) => {
    if (word1 === word2) {
        return SYNONYMS
    }
    if (dictionary[word1] && dictionary[word1].has(word2)) {
        return SYNONYMS
    }
    return DIFFERENT;
};

const checkTestCase = (testCase) => {
    const dictionary = parseDictionary(testCase.dictionary)
    console.log("dic", dictionary);

    for (const query of testCase.queries) {
        const word1 = query[0].toLowerCase()
        const word2 = query[1].toLowerCase()

        // console.log(word1,word2,dictionary)
        output.append(findSynonyms(word1, word2, dictionary))
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