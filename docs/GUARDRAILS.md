# AI Advisor Guardrails

The AI Business Advisor includes comprehensive safety guardrails to ensure responsible and appropriate interactions.

## Input Validation

### Length Limits
- **Minimum**: 3 characters (prevents empty/meaningless inputs)
- **Maximum**: 1000 characters (prevents abuse and ensures focused questions)

### Content Filtering
Blocked topics include:
- Loan approval requests
- Profit guarantees
- Illegal activities
- Gambling
- Cryptocurrency investment advice

Messages containing these topics receive a polite rejection with guidance to focus on operational business decisions.

## Rate Limiting

### Per-Minute Limit
- Maximum 10 messages per minute
- Prevents spam and abuse
- Ensures quality interactions

### Hourly Limit
- Maximum 50 messages per hour
- Sustainable usage level
- Protects system resources

## Response Safety

### No Guarantees
The AI will never:
- Approve loans
- Guarantee specific outcomes
- Promise profits
- Make investment decisions

### Automatic Detection
If users ask for guarantees or promises, the system automatically responds with:
> "I cannot guarantee specific outcomes or promise profits. Business involves risks, and results depend on many factors. However, I can help you analyze your current situation and suggest strategies based on data."

## Usage Transparency

### Character Counter
Real-time display of message length vs. maximum allowed

### Rate Limit Display
Shows current message count and limits:
- Messages this session
- Messages per minute count
- Clear feedback when limits are reached

## Content Moderation

### Flagged Messages
Messages that trigger content filters are marked with:
- Visual indicator (⚠️)
- "Content moderated" label
- Clear explanation of why it was flagged

### Educational Responses
Instead of just blocking, the system provides:
- Clear explanation of what's not allowed
- Suggestion for alternative questions
- Guidance on appropriate topics

## User Guidance

### Welcome Notice
Prominent "Safe & Responsible AI" card explains:
- What the advisor can and cannot do
- Limitations and disclaimers
- Professional validation recommendation

### Error Messages
Clear, helpful error messages for:
- Messages too short/long
- Blocked topics
- Rate limit exceeded
- System errors

## Privacy Protection

### Session-Only Data
- No permanent storage of conversations
- Messages cleared on page reload
- No cross-session tracking

### No Personal Data Collection
The advisor:
- Doesn't request personal information
- Works with business data only
- Maintains business context privacy

## Best Practices

### For Users
1. Ask specific, business-focused questions
2. Provide context for better advice
3. Validate suggestions with professionals
4. Use for operational guidance only

### For Developers
1. Monitor blocked content patterns
2. Update topic filters as needed
3. Review rate limits based on usage
4. Log errors for system improvement

## Implementation

The guardrails are implemented in `/src/app/advisor/page.tsx`:

```typescript
const GUARDRAILS = {
  maxMessageLength: 1000,
  minMessageLength: 3,
  blockedTopics: [
    "loan approval",
    "guarantee profit",
    "illegal",
    "gambling",
    "cryptocurrency investment advice",
  ],
  rateLimit: {
    maxMessagesPerMinute: 10,
    maxMessagesPerHour: 50,
  },
};
```

## Future Enhancements

Potential additions:
- ML-based content moderation
- Sentiment analysis
- Multi-language support
- Custom business-specific filters
- Advanced rate limiting per user/business
