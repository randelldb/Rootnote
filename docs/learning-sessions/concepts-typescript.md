# TypeScript & Fastify API Development - Learning Sessions

---

## Session: November 10, 2025 - Building a DELETE Endpoint for Plant Tracking API

### Session Overview
In this session, we implemented a DELETE endpoint for a plant tracking API, exploring REST API design patterns, Fastify route handling, TypeScript typing strategies, and SQL prepared statements. The learner demonstrated strong debugging instincts and engagement with core concepts around type safety and destructuring.

---

### Concepts Covered

#### 1. REST API Design - Resource Identification Patterns

When building REST APIs, there are three primary ways to identify which resource to operate on:

**a) URL Path Parameters** (Recommended for DELETE/PUT/PATCH)
```typescript
DELETE /plants/:id
// Example: DELETE /plants/123
```
- **Best for:** Identifying a single, specific resource
- **Pros:** Clean, RESTful, semantic URLs
- **Cons:** Limited to simple identifiers

**b) Query Parameters**
```typescript
DELETE /plants?id=123
// or DELETE /plants?variety=tomato&status=active
```
- **Best for:** Filtering collections, optional parameters
- **Pros:** Flexible, can combine multiple filters
- **Cons:** Less semantic for single resource operations

**c) Request Body**
```typescript
DELETE /plants
Body: { "id": 123 }
```
- **Best for:** Complex deletion criteria, bulk operations
- **Pros:** Can send complex data structures
- **Cons:** Less RESTful, DELETE with body is unconventional

**Decision Made:** We chose URL path parameters (`/plants/:id`) because:
- It's the most RESTful approach for single resource deletion
- The URL itself clearly indicates which resource is affected
- It follows common REST API conventions
- It's simple and explicit

---

#### 2. Fastify Route Parameters - Dynamic URL Segments

Fastify uses **colon syntax** to define dynamic route segments:

```typescript
app.delete("/plants/:id", async (request, response) => {
  // The :id portion becomes a route parameter
});
```

**How it works:**
- `:id` creates a named parameter called "id"
- Any value in that URL position gets captured
- Multiple parameters are supported: `/plants/:id/harvests/:harvestId`

**URL Matching Examples:**
```
Route: /plants/:id

✅ /plants/1       → id = "1"
✅ /plants/42      → id = "42"
✅ /plants/abc123  → id = "abc123"
❌ /plants         → No match (missing id)
❌ /plants/1/edit  → No match (extra segment)
```

---

#### 3. Accessing Route Parameters via request.params

Route parameters are accessed through the `request.params` object:

```typescript
app.delete("/plants/:id", async (request, response) => {
  console.log(request.params); // { id: "42" }
  const plantId = request.params.id;
});
```

**Important:** All route parameters come in as **strings**, never numbers:
```typescript
// URL: /plants/42
request.params.id // "42" (string), not 42 (number)
```

If you need a number, convert it explicitly:
```typescript
const plantId = parseInt(request.params.id, 10);
const plantId = Number(request.params.id);
const plantId = +request.params.id; // Unary plus operator
```

---

#### 4. SQL DELETE Statements with Prepared Statements

**Basic DELETE syntax:**
```sql
DELETE FROM table_name WHERE condition;
```

**Using Prepared Statements (better-sqlite3):**
```typescript
const deletePlantQuery = db.prepare(`DELETE FROM plants WHERE id = ?`);
const result = deletePlantQuery.run(id);
```

**Why prepared statements?**
- **SQL Injection Prevention:** User input is safely parameterized
- **Performance:** Query is parsed once, executed many times
- **Type Safety:** The database driver handles escaping

**Dangerous (vulnerable to SQL injection):**
```typescript
// ❌ NEVER DO THIS
db.prepare(`DELETE FROM plants WHERE id = ${id}`).run();
```

**Safe (parameterized):**
```typescript
// ✅ ALWAYS DO THIS
db.prepare(`DELETE FROM plants WHERE id = ?`).run(id);
```

---

#### 5. TypeScript Typing Challenges with request.params

**The Problem:**
By default, Fastify types `request.params` as `unknown` because it doesn't know what parameters your route defines:

```typescript
app.delete("/plants/:id", async (request, response) => {
  request.params // Type: unknown
  request.params.id // ❌ Error: Object is of type 'unknown'
});
```

**Why unknown?**
- TypeScript can't automatically infer route parameters from the string `/plants/:id`
- Different routes have different parameters
- `unknown` is safer than `any` - forces you to handle typing

---

#### 6. Type Assertions with 'as' Keyword

**Type Assertion (quick solution):**
```typescript
const { id } = request.params as { id: string };
```

**What it does:**
- Tells TypeScript: "Trust me, I know this is an object with an id property"
- No runtime checking - purely a compile-time hint
- Your responsibility to ensure correctness

**Type Assertion vs Type Annotation:**
```typescript
// Type Annotation - declares what type something IS
const age: number = 25;
let name: string;

// Type Assertion - tells TS to treat something as a type
const params = request.params as { id: string };
```

**When to use:**
- When you know more about the type than TypeScript can infer
- When working with external libraries
- As a temporary solution (generics are better for route handlers)

---

#### 7. Destructuring Syntax in JavaScript/TypeScript

**Object Destructuring** extracts properties from objects into variables:

```typescript
// Without destructuring
const params = request.params;
const id = params.id;

// With destructuring
const { id } = request.params;
```

**More destructuring examples:**
```typescript
// Multiple properties
const { id, name, variety } = plant;

// Renaming during destructuring
const { id: plantId } = request.params;

// Default values
const { id, status = 'active' } = request.body;

// Nested destructuring
const { params: { id }, query: { filter } } = request;
```

**Why destructuring?**
- More concise code
- Clear about what properties you're using
- Common pattern in modern JavaScript/TypeScript

---

#### 8. Fastify Generic Route Typing (Best Practice)

**The Better Solution:**
Instead of type assertions, use Fastify's generic typing system:

```typescript
app.delete<{ Params: { id: string } }>(
  "/plants/:id",
  async (request, response) => {
    const { id } = request.params; // TypeScript knows id exists and is a string!
  }
);
```

**Breaking it down:**
```typescript
app.delete<RouteGeneric>(path, handler)

interface RouteGeneric {
  Params?: { ... }    // URL parameters
  Querystring?: { ... } // Query string parameters
  Body?: { ... }       // Request body
  Headers?: { ... }    // Request headers
}
```

**Full example with multiple type parameters:**
```typescript
app.post<{
  Params: { id: string };
  Body: { name: string; variety: string };
  Querystring: { includeHarvests?: string };
}>(
  "/plants/:id",
  async (request, response) => {
    const { id } = request.params;           // ✅ Typed as string
    const { name, variety } = request.body;  // ✅ Both typed as string
    const { includeHarvests } = request.query; // ✅ Typed as string | undefined
  }
);
```

**Benefits:**
- Full autocomplete in your IDE
- Compile-time type checking
- Self-documenting code
- Catches errors before runtime

---

#### 9. URL Route Parameters Are Always Strings

**Critical Understanding:**
No matter what you put in the URL, route parameters are **always strings**:

```typescript
app.delete<{ Params: { id: string } }>( // Notice: string, not number
  "/plants/:id",
  async (request, response) => {
    const { id } = request.params; // id is a string
    
    // If you need it as a number:
    const plantId = parseInt(id, 10);
    
    // Or let SQLite handle the conversion:
    db.prepare(`DELETE FROM plants WHERE id = ?`).run(id);
    // SQLite will convert "42" to 42 automatically
  }
);
```

**Why?**
- HTTP is a text-based protocol
- URLs are strings
- The framework doesn't know if "123" should be a number, string, or something else
- Explicit conversion is clearer and safer

---

#### 10. HTTP Headers and Content-Type

**The Issue:**
When testing the DELETE endpoint, we initially used:
```
Content-Type: application/json
```

**The Problem:**
- `Content-Type` describes the **request body** format
- DELETE requests typically have **no body**
- Sending `Content-Type: application/json` with no body is semantically incorrect

**Correct Approach:**
```typescript
// DELETE request - no Content-Type needed
DELETE /plants/42
(no body, no Content-Type header)

// POST/PUT/PATCH with JSON body - Content-Type required
POST /plants
Content-Type: application/json
{ "name": "Tomato", "variety": "Roma" }
```

**HTTP Headers Quick Reference:**
- `Content-Type`: Format of data you're **sending**
- `Accept`: Format of data you want to **receive**
- `Authorization`: Authentication credentials
- `Content-Length`: Size of request body in bytes

---

### Final Implementation

Here's the complete DELETE endpoint we built:

```typescript
import Fastify from "fastify";
import Database from "better-sqlite3";

const app = Fastify({ logger: true });
const db = new Database("rootnote.db");

app.delete<{ Params: { id: string } }>(
  "/plants/:id",
  async (request, response) => {
    const { id } = request.params;
    
    let deletePlant;
    try {
      const deletePlantQuery = db.prepare(`DELETE FROM plants WHERE id = ?`);
      deletePlant = deletePlantQuery.run(id);
    } catch (error) {
      return response.status(400).send(error);
    }
    
    return response.status(200).send(deletePlant);
  }
);
```

**What this code does:**
1. Defines a DELETE route at `/plants/:id`
2. Uses TypeScript generics to type the `id` parameter as a string
3. Destructures `id` from `request.params`
4. Prepares a parameterized SQL DELETE query
5. Executes the query with the provided id
6. Returns error (400) if something goes wrong
7. Returns success (200) with deletion metadata if successful

**Return value from `.run()`:**
```typescript
{
  changes: 1,      // Number of rows affected
  lastInsertRowid: // Last inserted row ID (not relevant for DELETE)
}
```

---

### Key Debugging Insights Demonstrated

The learner showed excellent debugging instincts:

**1. Asking Discovery Questions:**
> "How could I know params was an object?"

This shows:
- Not accepting "magic" without understanding
- Desire to understand the underlying system
- Thinking about how to debug similar issues in the future

**How to discover it:**
```typescript
// Console logging
console.log(typeof request.params);
console.log(Object.keys(request.params));

// TypeScript hover tooltips in VS Code
// Hover over request.params to see type

// Check Fastify documentation
// Look at FastifyRequest interface definition
```

**2. Engaging with Type System Concepts:**
- Understanding the difference between type assertions and annotations
- Recognizing when TypeScript needs help vs when it can infer
- Seeing how destructuring interacts with typing

---

### Best Practices Learned

1. **Use URL path parameters for single resource operations**
   - RESTful and semantic
   - Clear and explicit

2. **Always use prepared statements for SQL queries**
   - Prevents SQL injection
   - Better performance

3. **Type your Fastify routes with generics**
   - Better than type assertions
   - Provides full type safety

4. **Only send Content-Type when you have a body**
   - DELETE typically has no body
   - POST/PUT/PATCH usually do

5. **Remember URL parameters are strings**
   - Convert explicitly if you need numbers
   - Or let your database handle conversion

6. **Use destructuring for cleaner code**
   - More readable
   - Common JavaScript/TypeScript pattern

7. **Wrap database operations in try-catch**
   - Gracefully handle errors
   - Return meaningful error responses

---

### Common Pitfalls to Avoid

❌ **SQL Injection:**
```typescript
// NEVER do this
db.prepare(`DELETE FROM plants WHERE id = ${id}`).run();
```

❌ **Ignoring TypeScript errors:**
```typescript
// @ts-ignore
request.params.id
```

❌ **Assuming route params are numbers:**
```typescript
const id = request.params.id; // This is a string!
if (id > 10) { } // String comparison, not numeric!
```

❌ **Not handling errors:**
```typescript
// No try-catch - server will crash on error
const result = db.prepare(`DELETE FROM plants WHERE id = ?`).run(id);
```

---

### Next Steps: Completing CRUD Operations

You've now implemented:
- ✅ **C**reate (POST /plants)
- ✅ **R**ead (GET /plants/:id)
- ✅ **D**elete (DELETE /plants/:id)

**Next up: UPDATE**

**Implementing PUT or PATCH:**

```typescript
// PUT - Full replacement
app.put<{
  Params: { id: string };
  Body: {
    name: string;
    variety: string;
    cultivar?: string;
    notes?: string;
  };
}>(
  "/plants/:id",
  async (request, response) => {
    const { id } = request.params;
    const { name, variety, cultivar, notes } = request.body;
    
    try {
      const updateQuery = db.prepare(`
        UPDATE plants 
        SET name = ?, variety = ?, cultivar = ?, notes = ?
        WHERE id = ?
      `);
      const result = updateQuery.run(name, variety, cultivar, notes, id);
      
      if (result.changes === 0) {
        return response.status(404).send({ error: "Plant not found" });
      }
      
      return response.status(200).send({ message: "Plant updated", ...result });
    } catch (error) {
      return response.status(400).send(error);
    }
  }
);

// PATCH - Partial update (more complex, requires dynamic SQL)
app.patch<{
  Params: { id: string };
  Body: Partial<{
    name: string;
    variety: string;
    cultivar: string;
    notes: string;
  }>;
}>(
  "/plants/:id",
  async (request, response) => {
    const { id } = request.params;
    const updates = request.body;
    
    // Build dynamic UPDATE query based on provided fields
    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return response.status(400).send({ error: "No fields to update" });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(", ");
    const values = [...Object.values(updates), id];
    
    try {
      const updateQuery = db.prepare(`
        UPDATE plants 
        SET ${setClause}
        WHERE id = ?
      `);
      const result = updateQuery.run(...values);
      
      if (result.changes === 0) {
        return response.status(404).send({ error: "Plant not found" });
      }
      
      return response.status(200).send({ message: "Plant updated", ...result });
    } catch (error) {
      return response.status(400).send(error);
    }
  }
);
```

**Topics to explore in UPDATE implementation:**
- PUT vs PATCH semantics
- Handling partial updates
- Checking if resource exists (404 vs 200)
- Dynamic SQL generation (for PATCH)
- Validating request body with Fastify schemas
- Returning updated resource vs operation metadata

---

### Additional Resources

**Fastify Documentation:**
- [Routes](https://www.fastify.io/docs/latest/Reference/Routes/)
- [TypeScript](https://www.fastify.io/docs/latest/Reference/TypeScript/)
- [Request](https://www.fastify.io/docs/latest/Reference/Request/)

**Better-SQLite3:**
- [Prepared Statements](https://github.com/WiseLibs/better-sqlite3/wiki/API#preparestring---statement)

**TypeScript:**
- [Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
- [Destructuring](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring)

**REST API Design:**
- [RESTful Resource Naming](https://restfulapi.net/resource-naming/)
- [HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

---

### Session Reflection

**What went well:**
- Strong engagement with type system concepts
- Good debugging instincts and curiosity
- Successfully implemented a fully functional DELETE endpoint
- Clear understanding of REST principles

**Key takeaways:**
- Route parameters in Fastify use `:parameter` syntax
- Always use prepared statements for SQL security
- TypeScript generics provide better type safety than assertions
- URL parameters are always strings
- Destructuring makes code more readable

**Keep building:**
- Complete the UPDATE endpoint to finish CRUD
- Explore validation with Fastify schemas
- Consider error handling patterns (404 for not found, 400 for bad request)
- Think about response structure consistency across endpoints

---

