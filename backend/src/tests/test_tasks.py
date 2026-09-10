import pytest

@pytest.fixture
def auth_client(client):
    client.post("/api/auth/register", json={"username": "testuser", "email": "test@example.com", "password": "password123"})
    resp = client.post("/api/auth/login", data={"username": "testuser", "password": "password123"})
    token = resp.json()["access_token"]
    client.headers = {"Authorization": f"Bearer {token}"}
    return client

@pytest.fixture
def setup_data(auth_client):
    board = auth_client.post("/api/boards/", json={"title": "Test Board"}).json()
    board_detail = auth_client.get(f"/api/boards/{board['id']}").json()
    return board_detail

def test_create_task(auth_client, setup_data):
    col_id = setup_data["columns"][0]["id"]
    response = auth_client.post(f"/api/columns/{col_id}/tasks", json={"title": "New Task", "description": "Desc"})
    assert response.status_code == 200
    assert response.json()["title"] == "New Task"

def test_update_task(auth_client, setup_data):
    col_id = setup_data["columns"][0]["id"]
    task = auth_client.post(f"/api/columns/{col_id}/tasks", json={"title": "Task", "description": ""}).json()
    
    response = auth_client.put(f"/api/tasks/{task['id']}", json={"title": "Updated Task", "description": "New Desc"})
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Task"

def test_delete_task(auth_client, setup_data):
    col_id = setup_data["columns"][0]["id"]
    task = auth_client.post(f"/api/columns/{col_id}/tasks", json={"title": "Task"}).json()
    
    response = auth_client.delete(f"/api/tasks/{task['id']}")
    assert response.status_code == 204

def test_move_task(auth_client, setup_data):
    col1_id = setup_data["columns"][0]["id"]
    col2_id = setup_data["columns"][1]["id"]
    
    task = auth_client.post(f"/api/columns/{col1_id}/tasks", json={"title": "Task to move"}).json()
    
    response = auth_client.patch(f"/api/tasks/{task['id']}/move", json={"column_id": col2_id, "position": 0})
    assert response.status_code == 200
    assert response.json()["column_id"] == col2_id
