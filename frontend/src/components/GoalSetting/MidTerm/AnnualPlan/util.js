export const splitPlan = (plan) => {
    const { item } = plan;
    const abstract = item[2].value;
    const items = [];
    let startIndex = 3;
    for (let i = 0; i < 3; i++) {
        const goals = [];
        for (let j = 0; j < 3; j++) {
            let goal = item[startIndex];
            if (goal.key === "text:goals") {
                goal = [goal];
                if (item[startIndex + 1].key === "text:goals") {
                    // another goal
                    goal.push(item[startIndex + 1]);
                    startIndex++;
                }
            }
            goals.push(goal);
            startIndex++;
        }
        items.push(goals);
    }
    return {
        abstract,
        items
    };
}