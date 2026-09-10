import pytest

@pytest.fixture
def auth_client(client):
    client.post("/api/auth/register", json={"username": "testuser", "email": "test@example.com", "password": "password123"})
    resp = client.post("/api/auth/login", data={"username": "testuser", "password": "password123"})
    token = resp.json()["access_token"]
    client.headers = {"Authorization": f"Bearer {token}"}
    return client

def test_create_board(auth_client):
    response = auth_client.post("/api/boards/", json={"title": "My Board"})
    assert response.status_code == 200
    assert response.json()["title"] == "My Board"
    assert "id" in response.json()

def test_list_boards(auth_client):
    auth_client.post("/api/boards/", json={"title": "Board 1"})
    auth_client.post("/api/boards/", json={"title": "Board 2"})
    response = auth_client.get("/api/boards/")
    assert response.status_code == 200
    assert len(response.json()) == 2

def test_get_board_detail(auth_client):
    board = auth_client.post("/api/boards/", json={"title": "Detail Board"}).json()
    response = auth_client.get(f"/api/boards/{board['id']}")
    assert response.status_code == 200
    assert len(response.json()["columns"]) == 3  # Default columns

def test_update_board(auth_client):
    board = auth_client.post("/api/boards/", json={"title": "Old Title"}).json()
    response = auth_client.put(f"/api/boards/{board['id']}", json={"title": "New Title"})
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"

def test_delete_board(auth_client):
    board = auth_client.post("/api/boards/", json={"title": "To Delete"}).json()
    response = auth_client.delete(f"/api/boards/{board['id']}")
    assert response.status_code == 204
    
    get_resp = auth_client.get(f"/api/boards/{board['id']}")
    assert get_resp.status_code == 404

def test_get_board_not_owner(client):
    # User 1 creates board
    client.post("/api/auth/register", json={"username": "user1", "email": "u1@example.com", "password": "pw"})
    t1 = client.post("/api/auth/login", data={"username": "user1", "password": "pw"}).json()["access_token"]
    board = client.post("/api/boards/", json={"title": "User 1 Board"}, headers={"Authorization": f"Bearer {t1}"}).json()
    
    # User 2 tries to read
    client.post("/api/auth/register", json={"username": "user2", "email": "u2@example.com", "password": "pw"})
    t2 = client.post("/api/auth/login", data={"username": "user2", "password": "pw"}).json()["access_token"]
    
    response = client.get(f"/api/boards/{board['id']}", headers={"Authorization": f"Bearer {t2}"})
    assert response.status_code == 404
