// MongoDB initialization script
// Runs once when the container is first created

db = db.getSiblingDB("ai_assessment");

// Create app user with read/write on the ai_assessment db
db.createUser({
  user: "app_user",
  pwd: "app_password",
  roles: [{ role: "readWrite", db: "ai_assessment" }],
});

// Create initial collections with schema validation stubs
db.createCollection("users");
db.createCollection("assessments");
db.createCollection("jobs");

// Indexes (will be managed by Mongoose in production, but good to have baseline)
db.users.createIndex({ email: 1 }, { unique: true });
db.assessments.createIndex({ createdBy: 1, createdAt: -1 });
db.jobs.createIndex({ status: 1, createdAt: -1 });
db.jobs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // TTL: 7 days

print("✅ MongoDB initialized: ai_assessment database ready");
