import { useState, useEffect } from 'react'
import './index.css'

// Learning progress data structure matching David's learning-progress.json
interface LearningProgress {
  python_cs50p: {
    current_week: number
    current_topic: string
    lessons_completed: string[]
    started: string
    last_completed: string
  }
  math_for_ai: {
    current_module: string
    current_topic: string
    lessons_completed: string[]
    started: string
    last_completed: string
  }
}

const learningData: LearningProgress = {
  python_cs50p: {
    current_week: 10,
    current_topic: "FastAPI & Modern Web Frameworks",
    lessons_completed: [
      "Day 1: Intro to Functions",
      "Day 2: Parameters + Return Values",
      "Day 3: Conditionals (if/elif/else)",
      "Day 4: Loops (for/while) - Range, iterating over lists/strings",
      "Day 5: Nested Loops + Loop Control (break/continue)",
      "Day 6: Exceptions - try/except blocks for error handling",
      "Day 7: Libraries - import, Standard Library (random, statistics)",
      "Day 8: Third-Party Libraries - PyPI, pip, requests module",
      "Day 9: APIs with requests - GET/POST, JSON parsing, error handling",
      "Day 10: OOP Basics - Classes, __init__, methods, attributes",
      "Day 11: Unit Testing - assert, pytest, writing test functions",
      "Day 12: File I/O - open(), read(), write(), with statement, CSV",
      "Day 13: Regular Expressions - re module, pattern matching, validation",
      "Day 14: OOP Inheritance - super(), method overriding, __str__, __repr__",
      "Day 15: Packages & Virtual Environments - pip, venv, requirements.txt",
      "Day 16: Decorators & Higher-Order Functions - @wraps, lru_cache, stacking",
      "Day 17: Generators & Iterators - yield, memory efficiency, lazy evaluation",
      "Day 18: Context Managers & with Statement - __enter__, __exit__, resource cleanup",
      "Day 19: Multithreading & Concurrency - threading module, I/O-bound tasks, locks",
      "Day 20: Asyncio & Async/Await - Event loop, coroutines, concurrent I/O",
      "Day 21: FastAPI Introduction - Modern async web framework, path/query parameters, automatic API documentation",
      "Day 22: FastAPI Deep Dive - Pydantic validation, dependency injection, ML model serving"
    ],
    started: "2026-02-09",
    last_completed: "2026-03-04"
  },
  math_for_ai: {
    current_module: "ml_system_design",
    current_topic: "Latency, Throughput & Batch Optimization",
    lessons_completed: [
      "Day 1: What is a Vector?",
      "Day 2: Dot Product + Cosine Similarity",
      "Day 3: Matrices + Matrix Multiplication",
      "Day 4: Derivatives - The slope of a function at any point",
      "Day 5: Chain Rule - How gradients flow through composed functions",
      "Day 6: Partial Derivatives - How functions change w.r.t. one variable",
      "Day 7: Gradient Vector - Direction of steepest ascent, foundation for gradient descent",
      "Day 8: Gradient Descent - The optimization algorithm that powers AI training",
      "Day 9: Convexity - Why some functions are easy to optimize and others aren't",
      "Day 10: Train/Validation/Test Split - The foundation of reliable AI evaluation",
      "Day 11: Normal Distribution - The bell curve, 68-95-99.7 rule, applications in ML",
      "Day 12: Bayes' Theorem - P(A|B) = P(B|A)P(A)/P(B), updating priors with data",
      "Day 13: Expectation and Variance - E[X], Var(X), why they matter for ML loss functions",
      "Day 14: Covariance and Correlation - Measuring how two variables move together",
      "Day 15: Learning Rates & Convergence - Step size, stability, adaptive optimizers",
      "Day 16: Training Loop Deep Dive - Forward pass, backward pass, weight updates, PyTorch loop",
      "Day 17: Module 4 Review - Complete ML training loop in mathematical terms",
      "Day 18: Overfitting, Underfitting & Cross-Validation - Bias-variance tradeoff, k-fold CV",
      "Day 19: Regularization - L1/L2 penalty, weight decay, preventing overfitting",
      "Day 20: Hyperparameter Tuning - Grid search, random search, Bayesian optimization",
      "Day 21: Model Deployment & MLOps Basics - Saving models, inference APIs, monitoring",
      "Day 22: Production Math - Latency, throughput, batch optimization, GPU memory calculations"
    ],
    started: "2026-02-09",
    last_completed: "2026-03-04"
  }
}

// Starfield component
function Starfield() {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    size: Math.random() > 0.8 ? 3 : 2
  }))

  return (
    <div className="stars">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            width: star.size,
            height: star.size
          }}
        />
      ))}
    </div>
  )
}

// Progress Bar component
function ProgressBar({ 
  current, 
  total, 
  color = "blue",
  label 
}: { 
  current: number
  total: number
  color?: "blue" | "purple" | "green"
  label: string 
}) {
  const percentage = Math.round((current / total) * 100)
  const colorClasses = {
    blue: "from-blue-500 to-cyan-400",
    purple: "from-purple-500 to-pink-400",
    green: "from-green-500 to-emerald-400"
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <span className="text-sm font-bold text-white">{percentage}%</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} progress-animate rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-white/50 mt-1">
        {current} of {total} lessons completed
      </div>
    </div>
  )
}

// Stat Card component
function StatCard({ 
  value, 
  label, 
  icon, 
  color = "blue" 
}: { 
  value: string | number
  label: string
  icon: string
  color?: "blue" | "purple" | "green" | "orange"
}) {
  const colorClasses = {
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
    green: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    orange: "from-orange-500/20 to-amber-500/20 border-orange-500/30"
  }

  return (
    <div className={`glass-card p-6 bg-gradient-to-br ${colorClasses[color]} hover:scale-105 transition-transform duration-300`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/60">{label}</div>
    </div>
  )
}

// Lesson Card component
function LessonCard({ 
  day, 
  title, 
  completed = false,
  index
}: { 
  day: string
  title: string
  completed?: boolean
  index: number
}) {
  return (
    <div 
      className={`glass-card p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer group ${
        completed ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-white/20'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          completed 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-white/10 text-white/40'
        }`}>
          {completed ? '✓' : index + 1}
        </div>
        <div className="flex-1">
          <div className="text-xs text-white/50 mb-1">{day}</div>
          <div className={`text-sm ${completed ? 'text-white' : 'text-white/70'}`}>
            {title}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App component
function App() {
  const [activeTab, setActiveTab] = useState<'python' | 'math'>('python')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const pythonLessons = learningData.python_cs50p.lessons_completed
  const mathLessons = learningData.math_for_ai.lessons_completed
  const totalPythonDays = 70 // Estimated total CS50P days
  const totalMathDays = 56 // Estimated total Math for AI days

  const daysSinceStart = Math.ceil(
    (new Date(learningData.python_cs50p.last_completed).getTime() - 
     new Date(learningData.python_cs50p.started).getTime()) / (1000 * 60 * 60 * 24)
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Starfield />
      
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Learning Progress
            </h1>
            <p className="text-white/60">
              David's CS50P Python & Math for AI/ML Journey
            </p>
          </div>
          <div className="glass-card px-4 py-2 text-sm text-white/70">
            <span className="text-white/50">Started:</span>{' '}
            {new Date(learningData.python_cs50p.started).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
            <span className="mx-2 text-white/30">|</span>
            <span className="text-white/50">Day {daysSinceStart}</span>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            value={pythonLessons.length} 
            label="Python Lessons" 
            icon="🐍" 
            color="blue" 
          />
          <StatCard 
            value={mathLessons.length} 
            label="Math Lessons" 
            icon="📐" 
            color="purple" 
          />
          <StatCard 
            value={Math.round(((pythonLessons.length + mathLessons.length) / (totalPythonDays + totalMathDays)) * 100) + '%'} 
            label="Overall Progress" 
            icon="🎯" 
            color="green" 
          />
          <StatCard 
            value={daysSinceStart} 
            label="Days Active" 
            icon="🔥" 
            color="orange" 
          />
        </div>
      </section>

      {/* Progress Bars */}
      <section className="max-w-6xl mx-auto mb-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6">Course Progress</h2>
          <ProgressBar 
            current={pythonLessons.length} 
            total={totalPythonDays} 
            color="blue"
            label="CS50P Python"
          />
          <ProgressBar 
            current={mathLessons.length} 
            total={totalMathDays} 
            color="purple"
            label="Math for AI/ML"
          />
        </div>
      </section>

      {/* Current Topics */}
      <section className="max-w-6xl mx-auto mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-card p-6 glow-blue">
            <div className="text-blue-400 text-sm font-medium mb-2">CURRENT PYTHON TOPIC</div>
            <h3 className="text-lg font-bold text-white mb-1">
              {learningData.python_cs50p.current_topic}
            </h3>
            <div className="text-white/50 text-sm">
              Week {learningData.python_cs50p.current_week}
            </div>
          </div>
          <div className="glass-card p-6 glow-purple">
            <div className="text-purple-400 text-sm font-medium mb-2">CURRENT MATH TOPIC</div>
            <h3 className="text-lg font-bold text-white mb-1">
              {learningData.math_for_ai.current_topic}
            </h3>
            <div className="text-white/50 text-sm">
              Module: {learningData.math_for_ai.current_module}
            </div>
          </div>
        </div>
      </section>

      {/* Lesson History Tabs */}
      <section className="max-w-6xl mx-auto">
        <div className="glass-card p-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('python')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'python'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              🐍 Python ({pythonLessons.length})
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'math'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              📐 Math ({mathLessons.length})
            </button>
          </div>

          {/* Lesson List */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {(activeTab === 'python' ? pythonLessons : mathLessons)
              .slice()
              .reverse()
              .map((lesson, index) => {
                const dayMatch = lesson.match(/Day (\d+):/)
                const day = dayMatch ? `Day ${dayMatch[1]}` : 'Lesson'
                const title = lesson.replace(/Day \d+:\s*/, '')
                
                return (
                  <LessonCard
                    key={index}
                    day={day}
                    title={title}
                    completed={true}
                    index={index}
                  />
                )
              })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 text-center text-white/40 text-sm">
        <p>Last updated: {new Date(learningData.python_cs50p.last_completed).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}</p>
        <p className="mt-2">Built by OpenClaw Agent — Nightly Build</p>
      </footer>
    </div>
  )
}

export default App
