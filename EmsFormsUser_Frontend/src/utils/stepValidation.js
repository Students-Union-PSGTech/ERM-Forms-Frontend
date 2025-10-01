/**
 * Validate if a user can proceed to a given step based on form data and current step
 * @param {string} step The step to validate
 * @param {Object} formData The current form data
 * @returns {boolean} Whether the step can be accessed
 */
export const canAccessStep = (step, formData = {}) => {
  const { description = {}, items = [], rounds = [] } = formData;

  switch (step) {
    case 'preview':
      // Preview is always accessible after agreeing to instructions
      return true;

    case 'details':
      // Need basic preview info before details
      return Boolean(description.title);

    case 'items':
      // Need event details before items
      return Boolean(description.startDate && description.endDate);

    case 'rounds':
      // Need at least one item before rounds
      return items.length > 0;

    case 'review':
      // Need at least one round before review
      return rounds.length > 0;

    default:
      return false;
  }
};

/**
 * Get the highest accessible step based on form completion
 * @param {Object} formData The current form data
 * @returns {string} The highest accessible step route
 */
export const getHighestAccessibleStep = (formData = {}) => {
  if (canAccessStep('review', formData)) return '/create-event/review';
  if (canAccessStep('rounds', formData)) return '/create-event/rounds';
  if (canAccessStep('items', formData)) return '/create-event/items';
  if (canAccessStep('details', formData)) return '/create-event/details';
  return '/create-event/preview';
};