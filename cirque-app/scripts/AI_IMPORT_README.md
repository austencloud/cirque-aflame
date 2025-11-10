# AI-Powered Natural Language Data Import

This script allows you to add clients, performers, agents, events, and contracts to your Firebase database by simply describing them in plain English!

## Setup

1. **Set your OpenAI API Key**

   You need an OpenAI API key to use the AI parsing feature. Get one at https://platform.openai.com/api-keys

   Then add it to your `.env` file:

   ```bash
   OPENAI_API_KEY=sk-your-key-here
   ```

   Or export it in your terminal session:

   ```bash
   export OPENAI_API_KEY="sk-your-key-here"
   ```

2. **Make sure your Firebase environment variables are set**

   The script uses your existing Firebase configuration from `.env`:

   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - etc.

## Usage

Run the import script:

```bash
npm run import
```

Then just start typing naturally! For example:

```
I worked with Jefferson Park District back in summer 2023.
The main contact was Sarah Martinez, her email is
sarah@jpd.org and phone is 555-1234. We did this huge
festival on July 15th at their main park and they paid
$800. I had John Smith do fire dancing and Maria Garcia
performed aerial silks. Both were amazing!

Also worked with Chicago Children's Theatre in October.
Contact is Mike Johnson, mike@cct.org. Did a school show
on October 23rd for $600. Had Jenny Lee juggle and Tom
Brown do magic tricks.

done
```

Type `done` on a new line when you're finished, and the AI will:

1. Parse all the information
2. Extract clients, performers, events, etc.
3. Show you a preview
4. Write everything to Firebase with proper relationships

## What the AI Can Understand

The AI is pretty smart and can extract:

- **Clients**: Names, emails, phones, addresses, notes
- **Performers**: Names, skills/acts, contact info, rates
- **Agents**: Names, commission rates, contact info
- **Events**: Titles, dates, locations, fees, which client/performers
- **Contracts**: Terms, dates, fees, status

You can be as casual or detailed as you want. The AI will figure it out!

## Tips

- Just type naturally - no special format needed
- Include dates when you remember them (AI is good at parsing dates)
- Mention money amounts with $ signs or words like "paid" or "fee"
- The AI will automatically link events to their clients and performers
- If you're not sure about something, leave it out - the AI handles missing info gracefully

## Example Inputs

### Simple Event

```
Did a birthday party for the Johnsons on June 5th. Paid $300. Had Sarah do balloon animals.
done
```

### Multiple Clients

```
Client 1: ABC Corporation, contact Jane Smith jane@abc.com, 555-1111
Did a corporate event last month for $1500

Client 2: XYZ School, contact Bob Lee bob@xyz.edu, 555-2222
School assembly in September for $800

Performer: Lisa Chen, does acrobatics and juggling, charges $200/hour
Performer: David Park, fire dancer, charges $250/hour

done
```

### With All Details

```
I've been working with the Springfield Arts Council for 3 years now.
Main contact is Emma Wilson, emma@springfieldarts.org, phone 555-9999.
Office at 123 Main St, Springfield.

Last year we did a huge summer festival on July 20, 2024 at City Park.
They paid $2500. I brought in 5 performers:
- Mike Rodriguez doing aerial acrobatics
- Sarah Kim with fire dancing
- Tommy Lee juggling
- Rachel Green doing stilt walking
- Chris Brown magic show

Everyone was great. Emma wants to book us again this summer.

done
```

## Troubleshooting

**"OPENAI_API_KEY not found"**

- Make sure you've set the API key in your `.env` file or exported it

**"No entities detected"**

- Try being more specific with names, dates, and what people did
- Make sure you mention who paid money (clients) vs who performed (performers)

**Firebase errors**

- Check your Firebase credentials in `.env`
- Make sure your Firebase project is set up and accessible

## What Gets Created

The script automatically creates proper database entries with:

- Unique IDs
- Timestamps (createdAt, updatedAt)
- Proper relationships between events/contracts and their clients/performers
- Default values for missing fields

Everything follows your existing TypeScript types!
