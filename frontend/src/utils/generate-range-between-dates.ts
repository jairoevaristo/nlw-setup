import dayjs from 'dayjs'

export function generateRangeBetweenDates() {
    const firtsDayOfTheYear = dayjs().startOf('year')
    const endDate = new Date();

    const dateRange = []
    let compareDate = firtsDayOfTheYear

    while (compareDate.isBefore(endDate)) {
        dateRange.push(compareDate.toDate())
        compareDate = compareDate.add(1, 'day')
      }

    return dateRange
}