/* --------------------------------------------------------------------------------------------------*/
/* -------------------------------------- DASHBOARD INSIGHTS --------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// Display the amount of clients
function displayClientCount(clients) {
    const clientAmount = document.getElementById('client-amount')
    clientAmount.textContent = clients.length 
}

// Display total billies
function displayTotalBillies(clients) {
    const allTotalBillies = clients.map(client => client.totalBillies)

    let totalBilliesSum = 0
    for (let i = 0; i < allTotalBillies.length; i++) {
        totalBilliesSum += allTotalBillies[i]
    }

    const totalBilliesOutput = document.getElementById('total-billies')
    totalBilliesOutput.textContent = totalBilliesSum
}

// Display claimed cards
function displayClaimedCards(clients) {
    const allClaimedBillies = clients.map(client => client.claimedBillies)

    let claimedCardsSum = 0
    for (let i = 0; i < allClaimedBillies.length; i++) {
        claimedCardsSum += allClaimedBillies[i]
    }

    const claimedCardsOutput = document.getElementById('claimed-cards')
    claimedCardsOutput.textContent = claimedCardsSum
}

// Calculate Overall Average Rating
function sentimentAnalysis(clients) {
    const allRatings = clients.map(client => client.averageRating)

    let ratingSum = 0
    for (let i = 0; i < allRatings.length; i++) {
        ratingSum += allRatings[i]
    }

    let ratingsNotZero = 0
    for (let i = 0; i < allRatings.length; i++) {
        if (allRatings[i] != 0) {
            ratingsNotZero += 1
        }
    }

    const overallRating = ratingSum / ratingsNotZero
    
    const sentimentOutput = document.getElementById('sentiment-analysis')
    sentimentOutput.textContent = overallRating.toFixed(2)
}

// Calculate Overall Average Expenditure
function displayAverageExpenditure(clients) {

    const allTotalsSpent = clients.map(client => client.totalSpent)

    let totalSum = 0
    for (let i = 0; i < allTotalsSpent.length; i++) {
        totalSum += allTotalsSpent[i]
    }

    const allTotalBillies = clients.map(client => client.totalBillies)

    let totalBilliesSum = 0
    for (let i = 0; i < allTotalBillies.length; i++) {
        totalBilliesSum += allTotalBillies[i]
    }

    const averageSpentOutput = document.getElementById('average-expenditure')

    if (totalBilliesSum > 0) {
        const overallExpenditure = totalSum / totalBilliesSum
        averageSpentOutput.textContent = "$ " + overallExpenditure.toFixed(2)
    } else {
        averageSpentOutput.textContent = "$ 0"
    }
    
}

// Display Total Profit
function displayTotalProfit(clients) {
    const allTotals = clients.map(client => client.totalSpent)

    let totalSum = 0
    for (let i = 0; i < allTotals.length; i++) {
        totalSum += allTotals[i]
    }
    
    const totalOutput = document.getElementById('total-profit')
    totalOutput.textContent = "$" + totalSum.toFixed(2)
}