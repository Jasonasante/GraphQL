const Url = "https://learn.01founders.co/api/graphql-engine/v1/graphql"
const ID = 546
const Username = "Jasonasante"
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
    "graphQL",
    "social-network", "social-network-cross-platform-appimage",
    "mini-framework", "mini-framework-bomberman-dom"
]

let skills = [
    "xp",
    "skill_css",
    "skill_go",
    "skill_html",
    "skill_front-end",
    "skill_back-end",
    "skill_algo",
    "skill_prog",
    "skill_js",
    "skill_game",
    "skill_docker",
    "skill_sys-admin",
    "skill_sql",
    "skill_gql"
]


let allProjectNames = goProjectNames.concat(jsProjectNames)
let lengthOfProjectNames = goProjectNames.concat(jsProjectNames).length

let transactionArr = []

let progressArr = []

let levelArr = []
let piscineGoLevel = []
let goProjectsLevel = []
let julyJsLevel = []
let jsProjectsLevel = []

let resultArr = []
let totalSkillArr=[]
let totalSkill = {}
let totalXp = {}
let totalGrade = {}

// this function returns an array of all transactions bar levels
function getTransactionData(URL) {
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

                piscineGoLevel = levelArr.filter(piscineGoLevel => piscineGoLevel["path"].startsWith('/london/piscine-go/'))
                    .sort((a, b) => { return new Date(a.createdAt) - new Date(b.createdAt) })

                goProjectsLevel = levelArr.filter(goProjects => (goProjects["path"].startsWith('/london/div-01/') &&
                    goProjectNames.includes(goProjects["object"]["name"]) ||
                    goProjects["path"].startsWith('/london/div-01/check-points/')))
                    .sort((a, b) => { return new Date(a.createdAt) - new Date(b.createdAt) })

                julyJsLevel = levelArr.filter(julyJsLevel => julyJsLevel["path"].startsWith('/london/div-01/piscine-js') &&
                    new Date(julyJsLevel.createdAt).getTime() >= new Date("2022-07-01T00:00:00Z").getTime())

                jsProjectsLevel = levelArr.filter(jsProjects => (jsProjects["path"].startsWith('/london/div-01/') &&
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
                        totalSkill[skill.type] = skill["amount"]
                    } else {
                        totalSkill[skill.type] += skill["amount"]
                    }
                })
                let total = 0
                for (let key in totalSkill) {
                    total += totalSkill[key]
                }
                totalSkill.total = total
                console.log({totalSkill})
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
                                    {object:{name:{_eq:"${goProjectNames.concat(jsProjectNames)[lengthOfProjectNames - 1]}"}}}
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
    let projectsOnly = resultArr.filter(project => goProjectNames.concat(jsProjectNames).includes(project.projectName))
    let orderXp = projectsOnly.sort((a, b) => b.xp - a.xp)
    console.log({ orderXp })

    totalXp["project-total"] = Number(orderXp.reduce((total, num) => total + num.xp, 0).toFixed(2))
    totalXp["avg-project-xp"] = Number((totalXp["project-total"] / orderXp.length).toFixed(2))
    totalXp.max = orderXp[0]
    totalXp.min = orderXp[orderXp.length - 1]
    totalXp["project-xp"] = orderXp
    console.log({ totalXp })

    let orderGrade = projectsOnly.sort((a, b) => b.grade - a.grade)
    console.log({ totalG })
    totalGrade["lifetime-total"] = Number(totalG.toFixed(2))
    totalGrade["project-total"] = Number(orderGrade.reduce((total, num) => total + num.grade, 0).toFixed(2))
    totalGrade.max = orderGrade[0]
    totalGrade.min = orderGrade[orderGrade.length - 1]
    let orderByDate = projectsOnly.sort((a, b) => { return new Date(b[1]) - new Date(a[1]) })
    totalGrade["project-grades"] = []

    totalGrade["project-grades"].push(orderGrade)
    console.log({ totalGrade })
}

// convert object values into percentage
function getPercentage(object) {
    let percentageValueObj = {}
    for (let key in object) {
        if (key != "total") {
            percentageValueObj[key] = Math.round(((object[key] / object.total) + Number.EPSILON) * 100)
        }
    }
    return percentageValueObj
}

getTransactionData(Url)
    .then(response => {
        console.log({ response })
        // add loading page here whilst fetching
        getTotalSkills()
        getProgressData(Url).then(() => {
            // console.log(getPercentage(totalSkill))
            getLevels()
            console.log({ progressArr })
            getTotalXpAndGrades(projectTransactions(response, progressArr))
            console.log({ resultArr })

        })
    }).then(
    // add javascript display functions here
    // take off loading screen
)
