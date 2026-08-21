import { describe, expect, it } from 'vitest'
import { createQuiz, mechanics, questionDifficulty } from '../src/data/difficulty'
import { objects } from '../src/data/objects'
import { questions } from '../src/data/questions'
import type { Difficulty } from '../src/types/quiz'
import { objectIdsForQuestion } from '../src/utils/preload'

describe('question bank', () => {
  it('contains exactly 78 unique sequential questions', () => {
    const ids = questions.map(question => question.id)
    expect(ids).toHaveLength(78)
    expect(new Set(ids).size).toBe(78)
    expect([...ids].sort((left, right) => left - right)).toEqual(Array.from({ length: 78 }, (_, index) => index + 1))
  })

  it('has one valid difficulty for every question', () => {
    const questionIds = questions.map(question => question.id).sort((left, right) => left - right)
    const difficultyIds = Object.keys(questionDifficulty).map(Number).sort((left, right) => left - right)
    expect(difficultyIds).toEqual(questionIds)
    for (const difficulty of Object.values(questionDifficulty)) expect([1, 2, 3]).toContain(difficulty)
  })

  it('references existing objects and contains valid answers', () => {
    for (const question of questions) {
      for (const objectId of objectIdsForQuestion(question)) expect(objects[objectId], `question ${question.id}: ${objectId}`).toBeDefined()

      switch (question.type) {
        case 'multiple_choice':
        case 'odd_one_out':
          expect(question.options, `question ${question.id}`).toContain(question.correct)
          break
        case 'missing_item':
          expect(question.candidates, `question ${question.id}`).toContain(question.correct)
          break
        case 'sorting': {
          const categoryIds = question.categories.map(category => category.id)
          expect(Object.keys(question.assignments).sort(), `question ${question.id}`).toEqual([...question.options].sort())
          for (const categoryId of Object.values(question.assignments)) expect(categoryIds, `question ${question.id}`).toContain(categoryId)
          break
        }
        case 'ranking': {
          const correct = question.correct.split(',')
          expect(correct, `question ${question.id}`).toHaveLength(question.options.length)
          expect([...correct].sort(), `question ${question.id}`).toEqual([...question.options].sort())
          break
        }
        case 'true_false':
          expect(typeof question.correct, `question ${question.id}`).toBe('boolean')
          break
      }
    }
  })

  it('has explanations for mechanics where the answer needs a factual explanation', () => {
    for (const question of questions) {
      if (question.type === 'true_false' || question.type === 'ranking') continue
      expect(question.explanation?.trim(), `question ${question.id}`).toBeTruthy()
    }
  })

  it('has explanations for false statements', () => {
    for (const question of questions) {
      if (question.type !== 'true_false' || question.correct) continue
      expect(question.explanation?.trim(), `question ${question.id}`).toBeTruthy()
    }
  })

  it.each([1, 2, 3] as Difficulty[])('builds a 12-question level %s session with two questions of every mechanic', difficulty => {
    for (const mechanic of mechanics) {
      const available = questions.filter(question => question.type === mechanic && questionDifficulty[question.id] === difficulty)
      expect(available.length, `${mechanic}, level ${difficulty}`).toBeGreaterThanOrEqual(2)
    }

    const quiz = createQuiz(difficulty)
    expect(quiz).toHaveLength(12)
    expect(quiz.every(question => questionDifficulty[question.id] === difficulty)).toBe(true)
    for (const mechanic of mechanics) expect(quiz.filter(question => question.type === mechanic), `${mechanic}, level ${difficulty}`).toHaveLength(2)
  })

  it('does not classify Pluto as a regular planet in question 25', () => {
    const question = questions.find(item => item.id === 25)
    expect(question?.type).toBe('sorting')
    if (!question || question.type !== 'sorting') return
    expect(question.options).toContain('o-venera')
    expect(question.options).not.toContain('o-pluton')
    expect(question.assignments['o-venera']).toBe('left')
  })
})
