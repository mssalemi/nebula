### Testing

Mock transcript into clips:
```bash
curl -X POST \
  http://localhost:3000/api/clip-markers \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "./fixtures/IMG_7362.vtt"
  }'
```