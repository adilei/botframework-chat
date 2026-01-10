/**
 * Sample adaptive card JSONs for demo mode.
 * These demonstrate various card features with dark theme styling.
 */

const ADAPTIVE_CARD_CONTENT_TYPE = 'application/vnd.microsoft.card.adaptive';

/**
 * Time off request card - polished design with balance display and form
 */
export const timeOffCard = {
  contentType: ADAPTIVE_CARD_CONTENT_TYPE,
  content: {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.5',
    body: [
      {
        type: 'TextBlock',
        text: 'Time Off Request',
        weight: 'bolder',
        size: 'large',
        spacing: 'none',
      },
      {
        type: 'TextBlock',
        text: 'Current Balance',
        weight: 'bolder',
        color: 'accent',
        spacing: 'medium',
      },
      {
        type: 'ColumnSet',
        columns: [
          {
            type: 'Column',
            width: 'stretch',
            items: [
              {
                type: 'TextBlock',
                text: '24h',
                color: 'accent',
                size: 'extraLarge',
                weight: 'bolder',
                horizontalAlignment: 'center',
              },
              {
                type: 'TextBlock',
                text: 'Sick Days',
                weight: 'bolder',
                size: 'small',
                horizontalAlignment: 'center',
                spacing: 'none',
              },
              {
                type: 'TextBlock',
                text: '8h/quarter',
                isSubtle: true,
                size: 'small',
                horizontalAlignment: 'center',
                spacing: 'none',
              },
            ],
          },
          {
            type: 'Column',
            width: 'stretch',
            items: [
              {
                type: 'TextBlock',
                text: '40h',
                color: 'accent',
                size: 'extraLarge',
                weight: 'bolder',
                horizontalAlignment: 'center',
              },
              {
                type: 'TextBlock',
                text: 'Wellness',
                weight: 'bolder',
                size: 'small',
                horizontalAlignment: 'center',
                spacing: 'none',
              },
              {
                type: 'TextBlock',
                text: '5 days/year',
                isSubtle: true,
                size: 'small',
                horizontalAlignment: 'center',
                spacing: 'none',
              },
            ],
          },
          {
            type: 'Column',
            width: 'stretch',
            items: [
              {
                type: 'TextBlock',
                text: '80h',
                color: 'accent',
                size: 'extraLarge',
                weight: 'bolder',
                horizontalAlignment: 'center',
              },
              {
                type: 'TextBlock',
                text: 'Vacation',
                weight: 'bolder',
                size: 'small',
                horizontalAlignment: 'center',
                spacing: 'none',
              },
              {
                type: 'TextBlock',
                text: '8h/month',
                isSubtle: true,
                size: 'small',
                horizontalAlignment: 'center',
                spacing: 'none',
              },
            ],
          },
        ],
        spacing: 'small',
      },
      {
        type: 'Input.ChoiceSet',
        id: 'leaveType',
        label: 'Type of leave',
        style: 'compact',
        value: 'vacation',
        choices: [
          { title: 'Vacation', value: 'vacation' },
          { title: 'Sick Day', value: 'sick' },
          { title: 'Wellness', value: 'wellness' },
          { title: 'Personal', value: 'personal' },
        ],
        spacing: 'medium',
      },
      {
        type: 'ColumnSet',
        columns: [
          {
            type: 'Column',
            width: 'stretch',
            items: [
              {
                type: 'Input.Date',
                id: 'startDate',
                label: 'Start Date',
              },
            ],
          },
          {
            type: 'Column',
            width: 'stretch',
            items: [
              {
                type: 'Input.Date',
                id: 'endDate',
                label: 'End Date',
              },
            ],
          },
        ],
        spacing: 'small',
      },
      {
        type: 'Input.Text',
        id: 'notes',
        label: 'Notes (optional)',
        placeholder: 'Any additional details...',
        isMultiline: true,
      },
    ],
    actions: [
      {
        type: 'Action.Submit',
        title: 'Submit Request',
        style: 'positive',
        data: { action: 'submitTimeOff' },
      },
    ],
  },
};

/**
 * Feedback card with radio buttons and submit action
 */
export const feedbackCard = {
  contentType: ADAPTIVE_CARD_CONTENT_TYPE,
  content: {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.5',
    body: [
      {
        type: 'TextBlock',
        text: 'How was your experience?',
        weight: 'bolder',
        size: 'medium',
        wrap: true,
      },
      {
        type: 'TextBlock',
        text: 'Your feedback helps us improve.',
        size: 'small',
        isSubtle: true,
        wrap: true,
      },
      {
        type: 'Input.ChoiceSet',
        id: 'rating',
        style: 'expanded',
        choices: [
          { title: 'Excellent', value: '5' },
          { title: 'Good', value: '4' },
          { title: 'Average', value: '3' },
          { title: 'Poor', value: '2' },
        ],
      },
      {
        type: 'Input.Text',
        id: 'comments',
        placeholder: 'Any additional comments? (optional)',
        isMultiline: true,
      },
    ],
    actions: [
      {
        type: 'Action.Submit',
        title: 'Submit Feedback',
        style: 'positive',
        data: { action: 'submitFeedback' },
      },
    ],
  },
};

/**
 * Weather card with columns and facts
 */
export const weatherCard = {
  contentType: ADAPTIVE_CARD_CONTENT_TYPE,
  content: {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.5',
    body: [
      {
        type: 'TextBlock',
        text: 'San Francisco, CA',
        weight: 'bolder',
        size: 'large',
      },
      {
        type: 'ColumnSet',
        columns: [
          {
            type: 'Column',
            width: 'auto',
            items: [
              {
                type: 'TextBlock',
                text: '72°',
                size: 'extraLarge',
                weight: 'bolder',
              },
            ],
          },
          {
            type: 'Column',
            width: 'stretch',
            items: [
              {
                type: 'TextBlock',
                text: 'Partly Cloudy',
                weight: 'bolder',
                spacing: 'small',
              },
              {
                type: 'TextBlock',
                text: 'Feels like 68°',
                isSubtle: true,
                spacing: 'none',
              },
            ],
            verticalContentAlignment: 'center',
          },
        ],
      },
      {
        type: 'FactSet',
        facts: [
          { title: 'Humidity', value: '65%' },
          { title: 'Wind', value: '12 mph NW' },
          { title: 'UV Index', value: '6 (High)' },
        ],
      },
    ],
    actions: [
      {
        type: 'Action.OpenUrl',
        title: 'View Full Forecast',
        url: 'https://weather.com',
      },
    ],
  },
};

/**
 * Product card with image
 */
export const productCard = {
  contentType: ADAPTIVE_CARD_CONTENT_TYPE,
  content: {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.5',
    body: [
      {
        type: 'Image',
        url: 'https://adaptivecards.io/content/cats/3.png',
        size: 'medium',
        horizontalAlignment: 'center',
      },
      {
        type: 'TextBlock',
        text: 'Wireless Headphones Pro',
        weight: 'bolder',
        size: 'medium',
        horizontalAlignment: 'center',
      },
      {
        type: 'TextBlock',
        text: '$149.99',
        size: 'large',
        color: 'accent',
        horizontalAlignment: 'center',
      },
      {
        type: 'TextBlock',
        text: 'Premium noise-canceling headphones with 30-hour battery life and crystal-clear audio.',
        wrap: true,
        horizontalAlignment: 'center',
        isSubtle: true,
      },
      {
        type: 'FactSet',
        facts: [
          { title: 'Battery', value: '30 hours' },
          { title: 'Noise Cancel', value: 'Active' },
          { title: 'In Stock', value: 'Yes' },
        ],
      },
    ],
    actions: [
      {
        type: 'Action.Submit',
        title: 'Add to Cart',
        style: 'positive',
        data: { action: 'addToCart', productId: 'WHP-001' },
      },
      {
        type: 'Action.OpenUrl',
        title: 'View Details',
        url: 'https://example.com/product',
      },
    ],
  },
};

/**
 * Suggested actions for quick replies
 */
export const suggestedActions = {
  suggestedActions: {
    actions: [
      {
        type: 'imBack',
        title: 'Request time off',
        value: 'I want to request time off',
      },
      {
        type: 'imBack',
        title: 'Check balance',
        value: 'What is my leave balance?',
      },
      {
        type: 'imBack',
        title: 'View calendar',
        value: 'Show my calendar',
      },
    ],
  },
};

// Export all cards as a collection
export const sampleCards = {
  timeOff: timeOffCard,
  feedback: feedbackCard,
  weather: weatherCard,
  product: productCard,
  suggestedActions,
};
