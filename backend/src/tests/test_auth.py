import pytest

def test_register_user(client):
    response = client.post("/api/auth/register", json={"username": "testuser", "email": "test@example.com", "password": "password123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_register_duplicate_username(client):
    client.post("/api/auth/register", json={"username": "testuser", "email": "test@example.com", "password": "password123"})
    response = client.post("/api/auth/register", json={"username": "testuser", "email": "test2@example.com", "password": "password123"})
    assert response.status_code == 400

def test_login(client):
    client.post("/api/auth/register", json={"username": "testuser", "email": "test@example.com", "password": "password123"})
    response = client.post("/api/auth/login", data={"username": "testuser", "password": "password123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password(client):
    client.post("/api/auth/register", json={"username": "testuser", "email": "test@example.com", "password": "password123"})
    response = client.post("/api/auth/login", data={"username": "testuser", "password": "wrong"})
    assert response.status_code == 401

def test_get_me(client):
    client.post("/api/auth/register", json={"username": "testuser", "email": "test@example.com", "password": "password123"})
    login_resp = client.post("/api/auth/login", data={"username": "testuser", "password": "password123"})
    token = login_resp.json()["access_token"]
    
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

def test_get_me_no_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
