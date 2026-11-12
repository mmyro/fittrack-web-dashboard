import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Removes the rendered components after each test
afterEach(() => {
  cleanup()
  localStorage.clear()
})

// jsdom does not implement <dialog>: this minimal version is enough for the tests
HTMLDialogElement.prototype.showModal = function showModal() {
  this.setAttribute('open', '')
}
HTMLDialogElement.prototype.close = function close() {
  this.removeAttribute('open')
  this.dispatchEvent(new Event('close'))
}