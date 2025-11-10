# 🎤 Voice-Powered Data Import

Your CircusSync dashboard now has an **AI-powered voice import feature**! Just speak naturally about your clients, performers, and events, and watch them automatically get added to your database.

## 🎯 How It Works

1. **Click the microphone button** on your dashboard
2. **Start talking** about your business naturally
3. **Click "Stop Recording"** when you're done
4. **Click "Process with AI"** to extract structured data
5. **Review** what the AI found
6. **Click "Add to Database"** to save everything to Firebase

## 🗣️ What You Can Say

Just talk naturally! The AI understands:

### Example 1: Quick Event Entry

```
I worked with Jefferson Park District last month.
The contact was Sarah Martinez at sarah@jpd.org.
We did a summer festival on July 15th and they paid $800.
```

### Example 2: Adding Multiple Performers

```
I have three new performers. First is John Smith, he does
fire dancing and juggling, his email is john@example.com.
Then there's Maria Garcia who does aerial silks, and
Tommy Lee who's a magician.
```

### Example 3: Full Event with Details

```
I'm doing a corporate event for ABC Company next week.
Main contact is Jane Wilson, jane@abc.com, phone 555-1234.
Event is on August 10th at their downtown office.
They're paying $1500. I'm bringing Sarah for fire dancing
and Mike for juggling.
```

## ✨ Features

- **🎙️ Speech Recognition**: Uses your browser's built-in speech-to-text (works best in Chrome/Edge)
- **🤖 AI Parsing**: GPT-4o-mini intelligently extracts:
  - Client names, emails, phones, addresses
  - Performer names, skills, rates
  - Event dates, locations, fees
  - Agent information
  - Contract details
- **🔗 Smart Linking**: Automatically connects events to their clients and performers
- **👀 Preview**: See exactly what will be added before saving
- **💾 One-Click Save**: Add everything to Firebase with a single button

## 🔧 Setup

Make sure you have your OpenAI API key set in `.env`:

```bash
OPENAI_API_KEY=sk-your-key-here
```

That's it! The feature will work automatically.

## 🌐 Browser Compatibility

**Speech Recognition:**

- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Safari (partial support)
- ❌ Firefox (not supported)

If speech recognition isn't available, you can still type or paste text!

## 💡 Tips for Best Results

1. **Speak clearly** and at a normal pace
2. **Mention specific details** like emails, phone numbers, dates
3. **Use names** - the AI links relationships by name
4. **Say monetary amounts** clearly ("they paid 800 dollars" or "$800")
5. **Include dates** in common formats ("July 15th", "7/15/2024", "last month")

## 🎨 What Gets Created

The AI automatically creates proper database entries with:

- ✅ Unique IDs
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Relationships (events → clients, events → performers)
- ✅ Default values for missing fields
- ✅ Proper data types (dates, numbers, strings)

## 🔐 Privacy & Security

- Speech is processed **locally** in your browser
- Only the **text transcript** is sent to OpenAI
- All data is saved to **your Firebase** database
- Your OpenAI API key is **never exposed** to the client

## 🐛 Troubleshooting

**"Speech recognition not supported"**

- Use Chrome or Edge browser
- Make sure you're using HTTPS (required for microphone access)

**"OPENAI_API_KEY not configured"**

- Check your `.env` file
- Make sure you've restarted the dev server after adding the key

**"No entities detected"**

- Try being more specific with names and details
- Make it clear who paid money (clients) vs who performed (performers)
- Speak more slowly and clearly

**Data not appearing in app**

- Refresh the page to see newly added data
- Check the browser console for errors
- Verify Firebase permissions are set correctly

## 🚀 Future Enhancements

Potential improvements:

- Multi-language support
- Voice commands for editing existing data
- Real-time suggestions while speaking
- Automatic duplicate detection
- Voice-to-email for sending contracts
- Integration with calendar apps

## 🎭 Example Use Cases

### End of Day Data Entry

At the end of a busy day, just talk through everything that happened:

```
"Today I met with three new clients. First was Springfield
Elementary, contact is Mr. Johnson..."
```

### Event Planning

Quickly capture event details while on a call:

```
"Taking notes for the new event. Client is ABC Corp, they
want a show on December 15th..."
```

### Performer Onboarding

Add new performers as you meet them:

```
"Just auditioned a new performer, her name is Sarah Chen,
she does aerial silks and contact juggling, email is
sarah.chen@gmail.com..."
```

---

**Pro Tip:** Keep the dashboard open during client calls and capture details in real-time! 🎪✨
