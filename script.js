// Food health scores - categorized more clearly
const FOOD_CATEGORIES = {
  // Super healthy foods
  SUPER_HEALTHY: ["salad"],
  // Moderately healthy foods
  HEALTHY: ["rice"],
  // Neutral foods
  NEUTRAL: ["sandwich"],
  // Unhealthy foods
  UNHEALTHY: ["pizza"],
  // Junk foods (very unhealthy)
  JUNK: ["friedchicken"],
}

// Age categories for better logic
const AGE_CATEGORIES = {
  YOUNG: { min: 0, max: 35 },
  MID: { min: 36, max: 75 },
  OLD: { min: 76, max: 120 },
}

// Gender life expectancy modifiers
const GENDER_MODIFIERS = {
  male: 0.95,
  female: 1.05,
}

// DOM elements
const form = document.getElementById("deathForm")
const humanFigure = document.getElementById("humanFigure")
const deathPit = document.getElementById("deathPit")
const resultsSection = document.getElementById("resultsSection")
const userImage = document.getElementById("userImage")
const userName = document.getElementById("userName")
const userAge = document.getElementById("userAge")
const userGender = document.getElementById("userGender")
const userFood = document.getElementById("userFood")
const timeRemaining = document.getElementById("timeRemaining")
const statusMessage = document.getElementById("statusMessage")

// Form submission handler
form.addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = new FormData(form)
  const userData = {
    name: formData.get("name"),
    age: Number.parseInt(formData.get("age")),
    gender: formData.get("gender"),
    food: formData.get("food"),
  }

  // Handle image upload
  const imageFile = formData.get("image")
  if (imageFile && imageFile.size > 0) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userImage.innerHTML = `<img src="${e.target.result}" alt="User">`
    }
    reader.readAsDataURL(imageFile)
  } else {
    userImage.innerHTML = '<span style="font-size: 2em;"></span>'
  }

  // Calculate death prediction
  const prediction = calculateDeathPrediction(userData)

  // Update scene positioning
  updateScenePosition(prediction, userData)

  // Display results
  displayResults(userData, prediction)

  // Show results section
  resultsSection.style.display = "block"

  
})

function calculateDeathPrediction(userData) {
  const { age, gender, food } = userData

  if (age > 80) {
    if (food === "pizza") {
      // Pizza + age >80 = less than 2 days, randomized
      const randomHours = Math.floor(Math.random() * 47) + 1 // 1-47 hours (less than 2 days)
      const randomMinutes = Math.floor(Math.random() * 60)
      const randomSeconds = Math.floor(Math.random() * 60)
      const totalMinutes = randomHours * 60 + randomMinutes + randomSeconds / 60

      return {
        maxAge: age,
        remainingYears: totalMinutes / (365.25 * 24 * 60),
        totalMinutes: totalMinutes,
        foodCategory: "EXTREME_JUNK",
        ageCategory: "OLD",
        baseLifeExpectancy: age,
        distanceFromCoffin: 0,
        isInPit: true,
        isLyingDown: true,
        extremeCase: "pizza",
      }
    } else if (food === "friedchicken") {
      // Fried chicken + age >80 = less than 1 day, randomized
      const randomHours = Math.floor(Math.random() * 23) + 1 // 1-23 hours (less than 1 day)
      const randomMinutes = Math.floor(Math.random() * 60)
      const randomSeconds = Math.floor(Math.random() * 60)
      const totalMinutes = randomHours * 60 + randomMinutes + randomSeconds / 60

      return {
        maxAge: age,
        remainingYears: totalMinutes / (365.25 * 24 * 60),
        totalMinutes: totalMinutes,
        foodCategory: "EXTREME_JUNK",
        ageCategory: "OLD",
        baseLifeExpectancy: age,
        distanceFromCoffin: 0,
        isInPit: true,
        isLyingDown: true,
        extremeCase: "friedchicken",
      }
    }
  }

  // Determine age category
  let ageCategory
  if (age <= AGE_CATEGORIES.YOUNG.max) {
    ageCategory = "YOUNG"
  } else if (age <= AGE_CATEGORIES.MID.max) {
    ageCategory = "MID"
  } else {
    ageCategory = "OLD"
  }

  let foodCategory
  if (food === "salad") {
    foodCategory = "SUPER_HEALTHY"
  } else if (food === "rice") {
    foodCategory = "HEALTHY"
  } else if (food === "sandwich") {
    foodCategory = "NEUTRAL"
  } else if (food === "pizza") {
    foodCategory = "UNHEALTHY"
  } else if (food === "friedchicken") {
    foodCategory = "JUNK"
  }

  let baseLifeExpectancy,
    remainingYears,
    distanceFromCoffin,
    isInPit = false,
    isLyingDown = false

  if (ageCategory === "YOUNG") {
    if (foodCategory === "SUPER_HEALTHY") {
      // Salad: Best choice, longest life
      baseLifeExpectancy = 90
      remainingYears = Math.max(50, baseLifeExpectancy - age)
    } else if (foodCategory === "HEALTHY") {
      // Rice: Good choice
      baseLifeExpectancy = 85
      remainingYears = Math.max(40, baseLifeExpectancy - age)
    } else if (foodCategory === "NEUTRAL") {
      // Sandwich: Average
      baseLifeExpectancy = 78
      remainingYears = Math.max(30, baseLifeExpectancy - age)
    } else if (foodCategory === "UNHEALTHY") {
      // Pizza: Poor choice
      baseLifeExpectancy = 65
      remainingYears = Math.max(20, baseLifeExpectancy - age)
    } else {
      // Fried chicken: Worst choice
      baseLifeExpectancy = 55
      remainingYears = Math.max(10, baseLifeExpectancy - age)
    }
  } else if (ageCategory === "MID") {
    if (foodCategory === "SUPER_HEALTHY") {
      baseLifeExpectancy = 85
      remainingYears = Math.max(25, baseLifeExpectancy - age)
    } else if (foodCategory === "HEALTHY") {
      baseLifeExpectancy = 80
      remainingYears = Math.max(20, baseLifeExpectancy - age)
    } else if (foodCategory === "NEUTRAL") {
      baseLifeExpectancy = 75
      remainingYears = Math.max(15, baseLifeExpectancy - age)
    } else if (foodCategory === "UNHEALTHY") {
      baseLifeExpectancy = 65
      remainingYears = Math.max(8, baseLifeExpectancy - age)
    } else {
      baseLifeExpectancy = 60
      remainingYears = Math.max(5, baseLifeExpectancy - age)
    }
  } else {
    // OLD age
    if (foodCategory === "SUPER_HEALTHY") {
      baseLifeExpectancy = age + 12
      remainingYears = Math.max(8, 12)
      isLyingDown = false // Keep standing for healthy choice
    } else if (foodCategory === "HEALTHY") {
      baseLifeExpectancy = age + 8
      remainingYears = Math.max(5, 8)
      isLyingDown = false
    } else if (foodCategory === "NEUTRAL") {
      baseLifeExpectancy = age + 4
      remainingYears = Math.max(3, 4)
      isLyingDown = false // Keep standing for neutral choice
    } else if (foodCategory === "UNHEALTHY") {
      baseLifeExpectancy = age + 2
      remainingYears = Math.max(1, 2)
      isLyingDown = true
    } else {
      // Fried chicken (but not extreme case)
      baseLifeExpectancy = age + 1
      remainingYears = Math.max(0.5, 1)
      isLyingDown = true
    }
  }

  // Apply gender modifier
  const genderModifier = GENDER_MODIFIERS[gender]
  remainingYears *= genderModifier

  // Convert to total minutes for display
  const totalMinutes = remainingYears * 365.25 * 24 * 60

  return {
    maxAge: Math.round(age + remainingYears),
    remainingYears: remainingYears,
    totalMinutes: totalMinutes,
    foodCategory: foodCategory,
    ageCategory: ageCategory,
    baseLifeExpectancy: baseLifeExpectancy,
    distanceFromCoffin: distanceFromCoffin,
    isInPit: isInPit,
    isLyingDown: isLyingDown,
  }
}

function updateScenePosition(prediction, userData) {
  const sceneWidth = document.querySelector(".scene").offsetWidth
  const humanWidth = 120
  const coffinWidth = 175
  const maxDistance = sceneWidth - humanWidth - coffinWidth - 100

  const { remainingYears, isInPit, isLyingDown, extremeCase } = prediction

  console.log("[v0] Positioning debug:", {
    remainingYears,
    sceneWidth,
    maxDistance,
    isInPit,
    isLyingDown,
    extremeCase
  })

  // Reset classes
  humanFigure.classList.remove("lying-down", "in-pit", "disappearing")
  deathPit.classList.remove("consuming")

  // Handle extreme cases (old age + pizza/fried chicken) - these should be in pit
  if (extremeCase === "pizza" || extremeCase === "friedchicken") {
    // Human is inside the coffin pit - position them centered in the coffin area and much lower
    humanFigure.style.left = `${sceneWidth - coffinWidth + 10}px`
    humanFigure.style.bottom = "15px" 
    humanFigure.classList.add("lying-down", "in-pit")
    
    // Add disappearing animation and coffin glow after a delay
    setTimeout(() => {
      humanFigure.classList.add("disappearing")
      deathPit.classList.add("consuming")
    }, 2000) 
    
    return 
  }

  if (isInPit) {
    humanFigure.style.left = `${sceneWidth - coffinWidth + 10}px` 
    humanFigure.style.bottom = "15px" 
    humanFigure.classList.add("lying-down", "in-pit")
    
    setTimeout(() => {
      humanFigure.classList.add("disappearing")
      deathPit.classList.add("consuming")
    }, 2000) // Wait 2 seconds before starting to disappear
  } else {
    let distanceFromCoffin

    // Less remaining years = closer to coffin
    if (remainingYears >= 50) {
      // 50+ years: Maximum distance from coffin (85-95% of max distance)
      distanceFromCoffin = 0.85 + (Math.min(remainingYears - 50, 40) / 40) * 0.10
    } else if (remainingYears >= 30) {
      // 30-49 years: Far from coffin (65-85% distance)
      distanceFromCoffin = 0.65 + ((remainingYears - 30) / 20) * 0.20
    } else if (remainingYears >= 15) {
      // 15-29 years: Moderate distance (40-65% distance)
      distanceFromCoffin = 0.40 + ((remainingYears - 15) / 15) * 0.25
    } else if (remainingYears >= 8) {
      // 8-14 years: Getting closer (25-40% distance)
      distanceFromCoffin = 0.25 + ((remainingYears - 8) / 7) * 0.15
    } else if (remainingYears >= 3) {
      // 3-7 years: Close to coffin (15-25% distance)
      distanceFromCoffin = 0.15 + ((remainingYears - 3) / 5) * 0.10
    } else if (remainingYears >= 1) {
      // 1-2 years: Very close to coffin (8-15% distance)
      distanceFromCoffin = 0.08 + ((remainingYears - 1) / 2) * 0.07
    } else {
      // Less than 1 year: Almost at the coffin (2-8% distance)
      distanceFromCoffin = 0.02 + (remainingYears / 1) * 0.06
    }

    // Add small random variation (±2%)
    const randomVariation = (Math.random() - 0.5) * 0.04
    distanceFromCoffin = Math.max(0.02, Math.min(0.95, distanceFromCoffin + randomVariation))

    console.log("[v0] Distance calculation:", {
      remainingYears,
      distanceFromCoffin,
      randomVariation,
      invertedDistance: 1 - distanceFromCoffin,
      finalDistanceFromLeft: maxDistance * (1 - distanceFromCoffin),
      coffinPosition: sceneWidth - coffinWidth,
    })

    if (isLyingDown) {
      // Human is lying down near coffin but not inside
      // INVERT the distance: More remaining years = farther from coffin (closer to left edge)
      const distanceFromLeft = maxDistance * (1 - distanceFromCoffin)
      humanFigure.style.left = `${50 + distanceFromLeft}px`
      humanFigure.style.bottom = "25px"  // Lower position for lying down but not in pit
      humanFigure.classList.add("lying-down")
    } else {
      // Human is standing at calculated distance
      // INVERT the distance: More remaining years = farther from coffin (closer to left edge)
      const distanceFromLeft = maxDistance * (1 - distanceFromCoffin)
      humanFigure.style.left = `${50 + distanceFromLeft}px`
      humanFigure.style.bottom = "5px"  // Position on ground level
    }

    console.log("[v0] Final position:", {
      leftPosition: humanFigure.style.left,
      bottomPosition: humanFigure.style.bottom,
      distanceFromCoffin: distanceFromCoffin,
      invertedDistance: 1 - distanceFromCoffin,
      actualDistanceFromLeft: maxDistance * (1 - distanceFromCoffin)
    })
  }
}

// Display results
function displayResults(userData, prediction) {
  // Update user info
  userName.textContent = userData.name
  userAge.textContent = `Age: ${userData.age} years`
  userGender.textContent = `Gender: ${userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)}`
  userFood.textContent = `Preferred Food: ${getFoodDisplayName(userData.food)}`

  // Calculate time breakdown
  const timeBreakdown = calculateTimeBreakdown(prediction.totalMinutes)

  // Display time remaining
  timeRemaining.innerHTML = `
        <div>${timeBreakdown.years} years</div>
        <div>${timeBreakdown.months} months</div>
        <div>${timeBreakdown.weeks} weeks</div>
        <div>${timeBreakdown.days} days</div>
        <div>${timeBreakdown.hours} hours</div>
        <div>${timeBreakdown.minutes} minutes</div>
    `

  // Display status message
  const status = getStatusMessage(prediction, userData)
  statusMessage.textContent = status
}

// Calculate time breakdown
function calculateTimeBreakdown(totalMinutes) {
  const years = Math.floor(totalMinutes / (365.25 * 24 * 60))
  const remainingMinutes = totalMinutes % (365.25 * 24 * 60)

  const months = Math.floor(remainingMinutes / (30.44 * 24 * 60))
  const remainingMinutesAfterMonths = remainingMinutes % (30.44 * 24 * 60)

  const weeks = Math.floor(remainingMinutesAfterMonths / (7 * 24 * 60))
  const remainingMinutesAfterWeeks = remainingMinutesAfterMonths % (7 * 24 * 60)

  const days = Math.floor(remainingMinutesAfterWeeks / (24 * 60))
  const remainingMinutesAfterDays = remainingMinutesAfterWeeks % (24 * 60)

  const hours = Math.floor(remainingMinutesAfterDays / 60)
  const minutes = Math.floor(remainingMinutesAfterDays % 60)

  return {
    years: years,
    months: months,
    weeks: weeks,
    days: days,
    hours: hours,
    minutes: minutes,
  }
}

function getFoodDisplayName(foodKey) {
  const foodNames = {
    salad: "Fresh Salad",
    rice: "Brown Rice",
    sandwich: "Sandwich",
    pizza: "Pizza",
    friedchicken: "Fried Chicken",
  }
  return foodNames[foodKey] || foodKey
}

function getStatusMessage(prediction, userData) {
  const { ageCategory, foodCategory, isInPit, remainingYears, extremeCase } = prediction


  if (extremeCase === "pizza") {
    return "💀 EXTREME DANGER: Pizza at your age?! You're literally digging your own grave!"
  } else if (extremeCase === "friedchicken") {
    return "💀 CRITICAL EMERGENCY: Fried chicken at 80+?! The grim reaper is knocking!"
  }

  if (isInPit) {
    return "💀 GAME OVER: You're already in the coffin! Your poor choices have caught up with you!"
  }

  if (ageCategory === "YOUNG") {
    if (foodCategory === "SUPER_HEALTHY") {
      return "🌟 EXCELLENT: Young and eating salad! You have a long, bright future ahead!"
    } else if (foodCategory === "HEALTHY") {
      return "👍 GOOD: Young and eating rice. Keep it up!"
    } else if (foodCategory === "NEUTRAL") {
      return "😊 MODERATE: Young with sandwich. Room for improvement!"
    } else if (foodCategory === "UNHEALTHY") {
      return "⚠️ WARNING: Young but eating pizza. Change now!"
    } else {
      return "💀 BAD: Young and eating fried chicken. Your choices are aging you fast!"
    }
  } else if (ageCategory === "MID") {
    if (foodCategory === "SUPER_HEALTHY") {
      return "👍 DECENT: Middle-aged but eating salad. Keep it up!"
    } else if (foodCategory === "HEALTHY") {
      return "🌟 GOOD: Middle-aged and eating rice. You're on the right track!"
    } else if (foodCategory === "NEUTRAL") {
      return "😐 MODERATE: Middle-aged with sandwich. Could be better."
    } else if (foodCategory === "UNHEALTHY") {
      return "😰 CONCERNING: Middle age + pizza = trouble ahead. Time to change!"
    } else {
      return "💀 BAD: Middle-aged and eating fried chicken. Your choices are aging you fast!"
    }
  } else {
    // OLD
    if (foodCategory === "SUPER_HEALTHY") {
      return "🙏 HANGING ON: Old age but eating salad is keeping you going!"
    } else if (foodCategory === "HEALTHY") {
      return "👍 GOOD: Old age but eating rice. You're doing well!"
    } else if (foodCategory === "NEUTRAL") {
      return "😐 MODERATE: Old-aged with sandwich. Could be better."
    } else if (foodCategory === "UNHEALTHY") {
      return "💀 CRITICAL: Old age + pizza = very little time left!"
    } else {
      return "💀 BAD: Old age and eating fried chicken. Your choices are aging you fast!"
    }
  }
}

// Initialize the scene
document.addEventListener("DOMContentLoaded", () => {
  // Set initial positions
  humanFigure.style.left = "50px"
  humanFigure.style.bottom = "50px"  
  deathPit.style.right = "50px"

  // Add some interactive elements with pixelated effects
  humanFigure.addEventListener("click", function () {
    this.style.transform = "scale(1.1)"
    this.style.filter = "brightness(1.2) contrast(1.3)"
    setTimeout(() => {
      this.style.transform = "scale(1)"
      this.style.filter = "contrast(1.2) saturate(1.1)"
    }, 200)
  })

  deathPit.addEventListener("click", function () {
    this.style.transform = "scale(1.1)"
    this.style.filter = "brightness(1.2) contrast(1.3)"
    setTimeout(() => {
      this.style.transform = "scale(1)"
      this.style.filter = "contrast(1.2) saturate(1.1)"
    }, 200)
  })
})

  const scene = document.querySelector(".scene")
  

document.head.appendChild(style)

// Initialize visual effects
addVisualEffects()
