"use client";
import { FaShoppingCart, FaUtensils, FaFilm } from 'react-icons/fa';
import { useState, useEffect } from "react";

export default function Budgeting() {
  const [goals, setGoals] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({ name: "", amount: "", spent: "", predetermine: [] });
  const [newPredetermine, setNewPredetermine] = useState("");
  const [expenseInputs, setExpenseInputs] = useState({}); // Manage input for each goal
  const [dailyExpenses, setDailyExpenses] = useState([]); // Track daily expenses
  const [starPositions, setStarPositions] = useState([]); // Store positions of existing stars

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem("goals"));
    const savedDailyExpenses = JSON.parse(localStorage.getItem("dailyExpenses"));
    if (savedGoals) {
      setGoals(savedGoals);
    }
    if (savedDailyExpenses) {
      setDailyExpenses(savedDailyExpenses);
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
    localStorage.setItem("dailyExpenses", JSON.stringify(dailyExpenses));
  }, [goals, dailyExpenses]);

  // Handle adding a new goal
  const handleGoalAdd = () => {
    if (!newGoal.name || !newGoal.amount) return;
    const newGoalData = {
      id: Date.now(),
      name: newGoal.name,
      goalAmount: parseFloat(newGoal.amount),
      spent: 0,
      predetermine: newGoal.predetermine.map(Number),
    };
    setGoals([...goals, newGoalData]);
    setNewGoal({ name: "", amount: "", spent: "", predetermine: [] });
    setIsPopupOpen(false);
  };

  // Handle editing a goal
  const handleEditGoal = (goal) => {
    setEditGoal({ ...goal });
  };

  // Save goal edits
  const handleSaveGoalEdit = () => {
    setGoals(goals.map((goal) => (goal.id === editGoal.id ? editGoal : goal)));
    setEditGoal(null);
  };

  // Add predetermined amount button
  const handleAddPredeterminedButton = () => {
    if (!newPredetermine) return;
    if (editGoal) {
      setEditGoal({
        ...editGoal,
        predetermine: [...editGoal.predetermine, parseFloat(newPredetermine)],
      });
    } else {
      setNewGoal({
        ...newGoal,
        predetermine: [...newGoal.predetermine, parseFloat(newPredetermine)],
      });
    }
    setNewPredetermine(""); // Reset input field after adding
  };

  // Remove a predetermined button
  const handleRemovePredeterminedButton = (index) => {
    setEditGoal({
      ...editGoal,
      predetermine: editGoal.predetermine.filter((_, i) => i !== index),
    });
  };

  // Add expense (auto-adds to current spending)
  const handleAddExpense = (amount, goalId) => {
    const currentDate = new Date().toLocaleDateString(); // Get current date

    // Update goals
    setGoals(goals.map((goal) =>
      goal.id === goalId
        ? { ...goal, spent: goal.spent + parseFloat(amount) }
        : goal
    ));

    // Add expense to daily summary
    setDailyExpenses((prev) => {
      const newExpense = { amount: parseFloat(amount), goalId, date: currentDate };
      return [...prev, newExpense];
    });
  };

  // Handle manual expense input (separate input for each goal)
  const handleManualExpenseInput = (goalId, e) => {
    setExpenseInputs({
      ...expenseInputs,
      [goalId]: e.target.value, // Update input only for the specific goal
    });
  };

  const handleSubmitExpense = (goalId) => {
    if (expenseInputs[goalId]) {
      handleAddExpense(expenseInputs[goalId], goalId); // Add the expense to the goal's spent amount
      setExpenseInputs({
        ...expenseInputs,
        [goalId]: "", // Reset the input for this goal after submission
      });
    }
  };

  // Handle deleting a goal
  const handleDeleteGoal = (goalId) => {
    const updatedGoals = goals.filter((goal) => goal.id !== goalId);
    setGoals(updatedGoals);
    setEditGoal(null); // Close the edit popup after deletion
  };

  // Calculate daily summary of expenses
  const getDailySummary = () => {
    const today = new Date().toLocaleDateString();
    const filteredExpenses = dailyExpenses.filter(exp => exp.date === today);
  
    const summary = filteredExpenses.reduce((acc, curr) => {
      const goal = goals.find(g => g.id === curr.goalId);
      const category = goal ? goal.name : "Uncategorized";
      
      // Skip "Uncategorized" categories
      if (category === "Uncategorized") return acc;
  
      acc[category] = (acc[category] || 0) + curr.amount;
      return acc;
    }, {});
  
    return summary;
  };

  const getRandomPosition = (existingPositions) => {
    let position;
    let overlap = true;
  
    const containerWidth = 90; 
    const containerHeight = 90;
  
    while (overlap) {
      const left = Math.random() * containerWidth + 5; 
      const top = Math.random() * containerHeight + 5; 
  
      // Check if the position overlaps with any existing star
      overlap = existingPositions.some(
        (star) =>
          Math.abs(star.left - left) < 10 && Math.abs(star.top - top) < 10 
      );
  
      if (!overlap) {
        position = { left, top };
      }
    }
    return position;
  };

  // Generate star positions whenever daily expenses are updated
  useEffect(() => {
    const dailySummary = getDailySummary();
    const newPositions = [];

    Object.entries(dailySummary).forEach(([category, amount]) => {
      const starSize = Math.min(amount / 5, 3);
      const opacity = Math.min(amount / 100, 1); 
      const position = getRandomPosition(newPositions);

      newPositions.push(position);
    });

    setStarPositions(newPositions); 
  }, [dailyExpenses]); 

  const dailySummary = getDailySummary();

  return (
    <div className="budgeting-container">
      <h1>Expenses</h1>

    {/* Daily Summary with Dynamic Starry Effect */}
    <div className="daily-summary">
    <h3>Today's Expenses Summary</h3>
    {Object.keys(dailySummary).length === 0 ? (
        <p>No expenses recorded today.</p>
    ) : (
        <div
        className="bubbles-container"
        style={{
            position: "relative",
            width: "100%",
            height: "200px",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gridTemplateRows: "repeat(5, 1fr)",
            gap: "10px",
        }}
        >
        {Object.entries(dailySummary).map(([category, amount], index) => {
            // Find the goal associated with this category
            const goal = goals.find((g) => g.name === category);
            const progress = goal ? (goal.spent / goal.goalAmount) * 100 : 0;

            // Determine the bubble color based on progress
            let bubbleColor = "#FF0050"; // Default color
            if (progress <= 50) {
            bubbleColor = "green"; // Under 50% - green
            } else if (progress <= 80) {
            bubbleColor = "yellow"; // Between 50% and 80% - yellow
            } else {
            bubbleColor = "red"; // Above 80% - red
            }

            return (
            <div
                key={category}
                className="bubble"
                style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: bubbleColor, // Dynamic color based on progress
                color: "black",
                fontSize: "1rem",
                gridColumn: `${(index % 5) + 1}`,
                gridRow: `${Math.floor(index / 5) + 1}`,
                width: `130px`,
                height: "130px",
                pointerEvents: "none",
                boxSizing: "border-box",
                marginTop: "20px",
                padding: "20px",
                }}
            >
                {category}: ${amount.toFixed(2)}
            </div>
            );
        })}
        </div>
    )}
    </div>

      {/* Total Expenses */}
      <h3>Total expenses - ${goals.reduce((total, goal) => total + goal.spent, 0).toFixed(2)}</h3>

      <button className="add-goal-btn" onClick={() => setIsPopupOpen(true)}>
        <span className="add-goal-icon">+</span>
        <span className="add-goal-text">+ Add Goal</span>
      </button>

      {/* Popup for adding new goal */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-popup" onClick={() => setIsPopupOpen(false)}>X</button>
            <h2>Add New Goal</h2>
            <input
              type="text"
              placeholder="Goal Name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Goal Amount"
              value={newGoal.amount}
              onChange={(e) => setNewGoal({ ...newGoal, amount: e.target.value })}
            />

            <h3>Preset Values</h3>
            {newGoal.predetermine.map((value, index) => (
              <div key={index}>
                <button onClick={() => handleAddExpense(value, newGoal.id)}>+${value}</button>
                <button onClick={() => handleRemovePredeterminedButton(index)}>Remove</button>
              </div>
            ))}

            {/* Input field for adding new predetermined value */}
            <input
              type="number"
              placeholder="Dollar Value"
              value={newPredetermine}
              onChange={(e) => setNewPredetermine(e.target.value)}
            />
            <button onClick={handleAddPredeterminedButton}>Add Preset Value</button>

            <button onClick={handleGoalAdd}>Add Goal</button>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="goals-list">
        {goals.map((goal) => {
          const progress = (goal.spent / goal.goalAmount) * 100;
          const progressColor = goal.spent > goal.goalAmount ? "red" : "green";

          return (
            <div 
              key={goal.id} 
              className="goal-card" 
              onClick={() => handleEditGoal(goal)}
              style={{ cursor: "pointer" }} // Makes it clear it's clickable
            >
              <div className="goal-details">
                <h3>{goal.name}</h3>
                <span>${goal.spent} / ${goal.goalAmount}</span>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{
                    width: `${Math.min(progress, 100)}%`, 
                    backgroundColor: progress <= 50 ? "green" : progress <= 80 ? "yellow" : "red"
                  }}
                ></div>
              </div>

              {/* Add Preset Buttons */}
              <div className="increment-buttons">
                {goal.predetermine.length > 0 &&
                  goal.predetermine.map((value, index) => (
                    <button key={index} onClick={(e) => { e.stopPropagation(); handleAddExpense(value, goal.id); }}>
                      +${value}
                    </button>
                  ))
                }
              </div>

              {/* Manual Add Expense */}
              <input
                type="number"
                placeholder="Add Amount"
                value={expenseInputs[goal.id] || ""}
                onChange={(e) => handleManualExpenseInput(goal.id, e)}
                onClick={(e) => e.stopPropagation()} // Prevents triggering edit mode when clicking the input
              />
              <button onClick={(e) => { e.stopPropagation(); handleSubmitExpense(goal.id); }}>Add</button>
            </div>
          );
        })}
      </div>

      {/* Edit Goal Popup */}
      {editGoal && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-popup" onClick={() => setEditGoal(null)}>X</button>
            <h2>Edit Goal</h2>

            <input
              type="text"
              value={editGoal.name}
              onChange={(e) => setEditGoal({ ...editGoal, name: e.target.value })}
            />
            <input
              type="number"
              value={editGoal.goalAmount}
              onChange={(e) => setEditGoal({ ...editGoal, goalAmount: parseFloat(e.target.value) })}
            />

            <h3>Preset Amounts</h3>
            {editGoal.predetermine.map((value, index) => (
              <div key={index}>
                <button onClick={() => handleAddExpense(value, editGoal.id)}>+${value}</button>
                <button onClick={() => handleRemovePredeterminedButton(index)}>Remove</button>
              </div>
            ))}

            {/* Input field for adding new predetermined value */}
            <input
              type="number"
              placeholder="New Preset Value"
              value={newPredetermine}
              onChange={(e) => setNewPredetermine(e.target.value)}
            />
            <button onClick={handleAddPredeterminedButton}>Add Preset Value</button>

            <button onClick={handleSaveGoalEdit}>Save</button>
            {/* Delete Button inside the Edit Menu */}
            <button onClick={() => handleDeleteGoal(editGoal.id)} className="delete-goal-btn">Delete Goal</button>
          </div>
        </div>
      )}
    </div>
  );
}