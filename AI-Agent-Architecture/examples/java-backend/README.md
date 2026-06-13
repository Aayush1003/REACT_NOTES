# Java Backend Example

This folder documents where to implement a Java/Spring Boot controller to proxy AI calls.

Example (Spring Boot controller):

```java
@RestController
@RequestMapping("/api/ai")
public class AiController {
	@PostMapping
	public ResponseEntity<?> handle(@RequestBody Map<String,Object> body){
		String input = (String) body.get("input");
		// call model adapter service
		Map<String,Object> resp = Map.of("reply", "Echo: "+input);
		return ResponseEntity.ok(resp);
	}
}
```

Notes:
- Use `WebClient` or `OkHttp` to call external model APIs.
- Keep API keys in environment variables or a vault.

