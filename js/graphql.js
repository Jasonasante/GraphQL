import { createHomepage } from "./ui/homepage-layout.js"
import { createLoader } from "./ui/loader.js"

const Url = "https://learn.01founders.co/api/graphql-engine/v1/graphql"
export const ID = 546
export const Username = "Jasonasante"
let transactionOffset = 0
let lvlOffset = 0
let progressOffset = 0
let skillsOffset = 0
const limit = 50

let goProjectNames = [
    "go-reloaded",
    "ascii-art", "ascii-art-reverse", "ascii-art-color", "ascii-art-output", "ascii-art-fs", "ascii-art-justify",
    "ascii-art-web", "ascii-art-web-stylize", "ascii-art-web-dockerize", "ascii-art-web-exportfile",
    "groupie-tracker", "groupie-tracker-searchbar", "groupie-tracker-filters", "groupie-tracker-gelocalization", "groupie-tracker-visualizations",
    "lem-in",
    "forum", "forum-image-upload", "forum-authentication", "forum-moderation", "forum-advanced-features"
]

let jsProjectNames = [
    "make-your-game", "make-your-game-score-handling", "make-your-game-history", "make-your-game-different-maps",
    "real-time-forum", "real-time-forum-typing-in-progress",
    "graphql",
    "social-network", "social-network-cross-platform-appimage",
    "mini-framework", "mini-framework-bomberman-dom"
]

// add rust
// add week four
// add challenges

let skills = [
    "xp"
]


let allProjectNames = goProjectNames.concat(jsProjectNames)
let lengthOfProjectNames = allProjectNames.length

let transactionArr = []

let progressArr = []

let levelArr = []

let resultArr = []
let totalSkillArr = []

let totalSkill = {}
let totalXp = {}
let totalGrade = {}
let totalLevel = {}

// this function returns an array of all transactions bar levels
export function getTransactionData(URL) {
    return fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `query {
                        transaction (limit:${limit}, offset:${transactionOffset}, where:{
                            _and:[{userId:{_eq:${ID}}}, {_not:{
                                _or:[
                                    {type:{_ilike:"%level%"}},
                                ]}
                        }
                        ]
                        }
                            ){
                            type
                            amount
                            objectId
                                object{
                                    name
                                }
                            userId
                            createdAt
                            path
                        }
                    }`,
        })
    })
        .then(response => response.json())
        .then(response => {
            if (response["data"]["transaction"].length > 0) {
                response["data"]["transaction"].forEach(transaction => {
                    transactionArr.push(transaction)
                })
                transactionOffset += limit
                return getTransactionData(URL)
            } else {
                return transactionArr
            }
        })
}

//gets the user's level over each project period
function getLevels() {
    fetch("https://learn.01founders.co/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `query {
                        transaction (limit:${limit}, offset:${lvlOffset}, where:{
                            _and:[{userId:{_eq:${ID}}},{type:{_ilike:"%level%"}}]
                            }
                            ){
                            type
                            amount
                            objectId
                                object{
                                    name
                                }
                            userId
                            createdAt
                            path
                        }
                    }`,
        })
    })
        .then(response => response.json())
        .then(response => {
            if (response["data"]["transaction"].length > 0) {
                response["data"]["transaction"].forEach(transaction => {
                    levelArr.push(transaction)
                })
                lvlOffset += limit
                return getLevels()
            } else {
                levelArr = levelArr.sort((a, b) => { return new Date(a.createdAt) - new Date(b.createdAt) })
                totalLevel["current-level"] = levelArr[levelArr.length - 1]

                totalLevel["piscine-go"] = levelArr.filter(piscineGoLevel => piscineGoLevel["path"].startsWith('/london/piscine-go/'))
                    .sort((a, b) => { return new Date(a.createdAt) - new Date(b.createdAt) })

                totalLevel["go-projects"] = levelArr.filter(goProjects => (goProjects["path"].startsWith('/london/div-01/') &&
                    goProjectNames.includes(goProjects["object"]["name"]) ||
                    goProjects["path"].startsWith('/london/div-01/check-points/')))
                    .sort((a, b) => { return new Date(a.createdAt) - new Date(b.createdAt) })

                totalLevel["piscine-js"] = levelArr.filter(julyJsLevel => julyJsLevel["path"].startsWith('/london/div-01/piscine-js') &&
                    new Date(julyJsLevel.createdAt).getTime() >= new Date("2022-07-01T00:00:00Z").getTime())

                totalLevel["js-projects"] = levelArr.filter(jsProjects => (jsProjects["path"].startsWith('/london/div-01/') &&
                    jsProjectNames.some(name => jsProjects["path"].includes(name))))
                    .sort((a, b) => { return new Date(a.createdAt) - new Date(b.createdAt) })

            }
        })
}

//returns an object contain the corresponding amount of each skill
function getTotalSkills() {
    fetch("https://learn.01founders.co/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `query {
                        transaction (limit:${limit}, offset:${skillsOffset}, where:{
                            _and:[{userId:{_eq:${ID}}},{type:{_ilike:"%skill%"}}]
                            }
                            ){
                            type
                            amount
                            objectId
                                object{
                                    name
                                }
                            createdAt
                            path
                        }
                    }`,
        })
    })
        .then(response => response.json())
        .then(response => {
            if (response["data"]["transaction"].length > 0) {
                response["data"]["transaction"].forEach(transaction => {
                    totalSkillArr.push(transaction)
                })
                skillsOffset += limit
                getTotalSkills()
            } else {
                totalSkillArr.forEach(skill => {
                    if (!totalSkill.hasOwnProperty(skill.type)) {
                        skills.push(skill.type)
                        totalSkill[skill.type] = skill["amount"]

                    } else {
                        totalSkill[skill.type] += skill["amount"]
                    }
                })
                let total = 0
                for (let key in totalSkill) {
                    total += totalSkill[key]
                }
                console.log(skills)
                totalSkill.total = total
            }
        })
}

// returns the progress data of main and optional projects
function getProgressData(Url) {
    return fetch(Url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `query {
                        progress (limit:${limit}, 
                            offset:${progressOffset}, 
                            where:{
                                _and:[
                                    {userId:{_eq:${ID}}},
                                    {object:{name:{_eq:"${allProjectNames[lengthOfProjectNames - 1]}"}}}
                                ]
                            }
                            ){
                            userId
                            objectId
                            object{
                                name
                                }
                            grade
                            createdAt
                            updatedAt   
                            }
                        }`,
        })
    })
        .then(response => response.json())
        .then(response => {
            if (lengthOfProjectNames > 0) {
                if (response["data"]["progress"].length != 0) {
                    progressArr.push(response["data"]["progress"][0])
                }
                lengthOfProjectNames--
                return getProgressData(Url)
            } else {
                return progressArr
            }
        })
}

// groups attributes of each project into an object
function projectTransactions(transactionArr, progressArr) {
    progressArr.forEach(progress => {
        resultArr.push({ projectName: progress["object"]["name"] })
        let obj = resultArr.find(project => project.projectName === progress["object"]["name"])
        transactionArr.filter(transaction => transaction["object"]["name"] === progress["object"]["name"])
            .forEach(transaction => {
                skills.forEach(skill => {
                    if (transaction["type"] === skill) {
                        if (obj.hasOwnProperty(skill)) {
                            obj[skill] += transaction["amount"]
                        } else {
                            obj[skill] = transaction["amount"]
                        }
                    } else { return }
                })
                obj.path = transaction["path"]
            })
        obj.updated = progress.updatedAt
        obj.created = progress.createdAt
        obj.grade = progress.grade
    })
    return resultArr
}

//obtain overall xp and grades data and place data into respective object
function getTotalXpAndGrades(resultArr) {
    let totalX = 0
    let totalG = 0
    resultArr.forEach(project => {
        if (project.hasOwnProperty("xp")) {
            totalX += project.xp
        }
        if (project.hasOwnProperty("grade")) {
            totalG += project.grade
        }
    })
    totalXp["lifetime-total"] = totalX
    let projectsOnly = resultArr.filter(project => allProjectNames.includes(project.projectName))
    let orderXp = projectsOnly.sort((a, b) => b.xp - a.xp)

    totalXp["project-total"] = Number(orderXp.reduce((total, num) => total + num.xp, 0).toFixed(2))
    totalXp["avg-project-xp"] = Number((totalXp["project-total"] / orderXp.length).toFixed(2))
    totalXp.max = orderXp[0]
    totalXp.min = orderXp[orderXp.length - 1]
    totalXp["project-xp"] = []
    orderXp.forEach(project => totalXp["project-xp"].push(project))

    let orderGrade = projectsOnly.sort((a, b) => b.grade - a.grade)
    totalGrade["lifetime-total"] = Number(totalG.toFixed(2))
    totalGrade["project-total"] = Number(orderGrade.reduce((total, num) => total + num.grade, 0).toFixed(2))
    totalGrade.max = orderGrade[0]
    totalGrade.min = orderGrade[orderGrade.length - 1]
    totalGrade["project-grades"] = []
    orderGrade.forEach(project => totalGrade["project-grades"].push(project))
}

window.onload = () => {
    createLoader(true)
    getTransactionData(Url)
        .then(response => {
            getTotalSkills()
            getLevels()
            return getProgressData(Url).then(() => {
                getTotalXpAndGrades(projectTransactions(response, progressArr))
            })
        }).then(() => {
            console.log(progressArr)
            createHomepage(totalLevel, totalSkill, totalXp, totalGrade)
            setTimeout(() => createLoader(false), 5000)
        })
}
