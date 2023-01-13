import { ID, Username } from "../graphql.js"

export function createHomepage(totalLevel, totalSkill, totalXp, totalGrade) {
    const homepage = document.createElement('div')
    homepage.classList.add("homepage-container")
    document.body.appendChild(homepage)

    displayHeader(homepage)
    displayProjects(homepage, totalXp, totalSkill)

    const lineGraphsContainer = document.createElement('div')
    lineGraphsContainer.classList.add('line-graphs-container')

    const skillsContainer = document.createElement('div')
    skillsContainer.classList.add('skills-container')



    displayOther(homepage, totalXp, totalGrade, totalLevel)

    const footer = document.createElement('div')
    footer.classList.add('item')
    footer.classList.add('footer')

    homepage.appendChild(lineGraphsContainer)
    homepage.appendChild(skillsContainer)
    homepage.appendChild(footer)

    const footerTitle = document.createElement('p')
    footerTitle.classList.add('footer-title')
    footerTitle.innerText = "Add Message"
    footer.appendChild(footerTitle)
}

function displayHeader(homepage) {
    const header = document.createElement('div')
    header.classList.add('item')
    header.classList.add('header')

    const headerTitle = document.createElement('h1')
    headerTitle.classList.add('header-title')
    headerTitle.innerText = Username + " GraphQL"
    header.appendChild(headerTitle)
    homepage.appendChild(header)
}

function displayProjects(homepage, totalXp, totalSkill) {
    const projectsContainer = document.createElement('div')
    projectsContainer.classList.add('projects-container')
    homepage.appendChild(projectsContainer)

    const projectTitle = document.createElement('h1')
    projectTitle.classList.add('project-title')
    projectTitle.innerText = "Projects"
    projectsContainer.appendChild(projectTitle)

    const projectNames = document.createElement('div')
    projectNames.classList.add('project-names')
    projectsContainer.appendChild(projectNames)

    totalXp["project-xp"].forEach(project => {
        const projectButton = document.createElement('button')
        projectButton.classList.add('project-buttons')
        projectButton.type = "button"
        const projectButtonName = document.createElement('h2')
        projectButtonName.innerHTML = project["projectName"][0].toUpperCase() + project["projectName"].substring(1).replaceAll("-", " ")
        projectButton.appendChild(projectButtonName)

        const projectXpGradeInfo = document.createElement('div')
        projectXpGradeInfo.classList.add('project-xp-grade-info')
        projectButton.appendChild(projectXpGradeInfo)

        const projectButtonXp = document.createElement('h3')
        projectButtonXp.innerHTML = "Xp: " + Math.round(((project["xp"] / 1000) + Number.EPSILON) * 100) / 100 + "kB"
        projectXpGradeInfo.appendChild(projectButtonXp)

        const projectGrade = document.createElement('h3')
        projectGrade.innerHTML = "Grade: " + Math.round(((project["grade"]) + Number.EPSILON) * 100) / 100
        projectXpGradeInfo.appendChild(projectGrade)

        const projectTimeInfo = document.createElement('div')
        projectTimeInfo.classList.add('project-time-info')
        projectButton.appendChild(projectTimeInfo)

        const projectCreated = document.createElement('h3')
        projectCreated.innerHTML = "CreatedAt: " + new Date(project["created"]).toLocaleString()
        projectTimeInfo.appendChild(projectCreated)
        const projectUpdated = document.createElement('h3')
        projectUpdated.innerHTML = "UpdatedAt: " + new Date(project["updated"]).toLocaleString()
        projectTimeInfo.appendChild(projectUpdated)

        const projectInfo = document.createElement('div')
        projectInfo.classList.add('project-skills-info')
        projectButton.appendChild(projectInfo)
        for (let key in totalSkill) {
            if (project.hasOwnProperty(key)) {
                const projectSkill = document.createElement('p')
                projectSkill.innerHTML = key.replace("skill_", "") + ": " + project[key]
                projectInfo.appendChild(projectSkill)
            }
        }
        projectNames.appendChild(projectButton)
        // projectButton.onclick=()=>{
        //     location.href="https://learn.01founders.co/git/jasonasante/"+project["projectName"]
        // }
    })
}

function displayOther(homepage, totalXp, totalGrade, totalLevel) {
    const otherContainer = document.createElement('div')
    otherContainer.classList.add('other-container')
    homepage.appendChild(otherContainer)

    const otherTitle = document.createElement('h1')
    otherTitle.classList.add('other-title')
    otherTitle.innerText = "User Info"
    otherContainer.appendChild(otherTitle)

    const userId = document.createElement('h2')
    userId.innerHTML = "userId: " + ID
    otherContainer.appendChild(userId)

    const campus = document.createElement('h2')
    campus.innerHTML = "Campus: London"
    otherContainer.appendChild(campus)

    const infoButtonDiv = document.createElement('div')
    infoButtonDiv.classList.add('info-button-container')
    otherContainer.appendChild(infoButtonDiv)

    const infoDiv = document.createElement('div')
    infoDiv.classList.add('info-container')
    otherContainer.appendChild(infoDiv)

    const currentButton = document.createElement('button')
    currentButton.classList.add('current-button')
    currentButton.type = "button"
    currentButton.innerHTML = "Current"
    infoButtonDiv.appendChild(currentButton)

    const xpButton = document.createElement('button')
    xpButton.classList.add('current-button')
    xpButton.type = "button"
    xpButton.innerHTML = "Xp"
    infoButtonDiv.appendChild(xpButton)

    const gradesButton = document.createElement('button')
    gradesButton.classList.add('current-button')
    gradesButton.type = "button"
    gradesButton.innerHTML = "Grade"
    infoButtonDiv.appendChild(gradesButton)

    const levelInfoDiv = document.createElement('div')
    levelInfoDiv.classList.add('level-info')
    infoDiv.appendChild(levelInfoDiv)

    const otherLevelTitle = document.createElement('h1')
    otherLevelTitle.classList.add('other-level-title')
    otherLevelTitle.innerText = "Current"
    levelInfoDiv.appendChild(otherLevelTitle)

    const currentLevel = document.createElement('h2')
    currentLevel.innerHTML = "Current Level: " + totalLevel["current-level"]["amount"]
    levelInfoDiv.appendChild(currentLevel)

    const currentProject = document.createElement('h2')
    let currentProjectArr = totalXp["project-xp"]
        .filter(recentXp => recentXp.projectName === totalLevel["current-level"]["object"]["name"])
    console.log(currentProjectArr)
    let currentXp = currentProjectArr[0]["xp"]
    let currentGrade = currentProjectArr[0]["grade"]
    currentProject.innerHTML = "Latest Project: " +
        totalLevel["current-level"]["object"]["name"][0].toUpperCase() +
        totalLevel["current-level"]["object"]["name"].substring(1).replaceAll("-", " ")
    levelInfoDiv.appendChild(currentProject)
    const currentProjectXp = document.createElement('h2')
    currentProjectXp.innerHTML = "Current Xp Gained: "
        + Math.round(((currentXp / 1000) + Number.EPSILON) * 100) / 100 + "kB"
    levelInfoDiv.appendChild(currentProjectXp)
    const currentProjectGrade = document.createElement('h2')
    currentProjectGrade.innerHTML = "Current Project Grade: " + Math.round((currentGrade + Number.EPSILON) * 100) / 100
    levelInfoDiv.appendChild(currentProjectGrade)

    const xpInfoDiv = document.createElement('div')
    xpInfoDiv.classList.add('xp-info')
    // infoDiv.appendChild(xpInfoDiv)

    const otherXpTitle = document.createElement('h1')
    otherXpTitle.classList.add('other-xp-title')
    otherXpTitle.innerText = "Xp"
    xpInfoDiv.appendChild(otherXpTitle)

    const totalProjectXp = document.createElement('h2')
    totalProjectXp.innerHTML = "Total Project Xp: " + Math.round(((totalXp["project-total"] / 1000) + Number.EPSILON) * 100) / 100 + "kB"
    xpInfoDiv.appendChild(totalProjectXp)

    const avgProjectXp = document.createElement('h2')
    avgProjectXp.innerHTML = "Avg Project Xp: " + Math.round(((totalXp["avg-project-xp"] / 1000) + Number.EPSILON) * 100) / 100 + "kB"
    xpInfoDiv.appendChild(avgProjectXp)

    const maxProjectXp = document.createElement('h2')
    maxProjectXp.innerHTML = "Maximum Xp: " +
        totalXp["max"]["projectName"][0].toUpperCase() +
        totalXp["max"]["projectName"].substring(1).replaceAll("-", " ") +
        "=>" + Math.round(((totalXp["max"]["xp"] / 1000) + Number.EPSILON) * 100) / 100 + "kB"
    xpInfoDiv.appendChild(maxProjectXp)

    const minProjectXp = document.createElement('h2')
    minProjectXp.innerHTML = "Minimum Xp: " +
        totalXp["min"]["projectName"][0].toUpperCase() +
        totalXp["min"]["projectName"].substring(1).replaceAll("-", " ") +
        "=>" + Math.round(((totalXp["min"]["xp"] / 1000) + Number.EPSILON) * 100) / 100 + "kB"
    xpInfoDiv.appendChild(minProjectXp)

    const gradeInfoDiv = document.createElement('div')
    gradeInfoDiv.classList.add('grade-info')
    // infoDiv.appendChild(gradeInfoDiv)

    const otherGradeTitle = document.createElement('h1')
    otherGradeTitle.classList.add('other-grade-title')
    otherGradeTitle.innerText = "Grade"
    gradeInfoDiv.appendChild(otherGradeTitle)

    const totalProjectGrade = document.createElement('h2')
    totalProjectGrade.innerHTML = "Total Project Grade: " + totalGrade["project-total"]
    gradeInfoDiv.appendChild(totalProjectGrade)

    const avgProjectGrade = document.createElement('h2')
    avgProjectGrade.innerHTML = "Avg Project Grade: " +
        Math.round(((totalGrade["project-total"] / totalGrade["project-grades"].length)
            + Number.EPSILON) * 100) / 100
    gradeInfoDiv.appendChild(avgProjectGrade)

    const maxGradeProject = document.createElement('h2')
    maxGradeProject.innerHTML = "Maximum Grade: " +
        totalGrade["max"]["projectName"][0].toUpperCase() +
        totalGrade["max"]["projectName"].substring(1).replaceAll("-", " ") +
        "=>" + Math.round(((totalGrade["max"]["grade"]) + Number.EPSILON) * 100) / 100
    gradeInfoDiv.appendChild(maxGradeProject)

    const minGradeProject = document.createElement('h2')
    minGradeProject.innerHTML = "Minimum Grade: " +
        totalGrade["min"]["projectName"][0].toUpperCase() +
        totalGrade["min"]["projectName"].substring(1).replaceAll("-", " ") +
        "=>" + Math.round(((totalGrade["min"]["grade"]) + Number.EPSILON) * 100) / 100
    gradeInfoDiv.appendChild(minGradeProject)

    xpButton.onclick = () => {
        infoDiv.firstChild.remove()
        infoDiv.appendChild(xpInfoDiv)
    }
    currentButton.onclick = () => {
        infoDiv.firstChild.remove()
        infoDiv.appendChild(levelInfoDiv)
    }
    gradesButton.onclick = () => {
        infoDiv.firstChild.remove()
        infoDiv.appendChild(gradeInfoDiv)
    }
}
