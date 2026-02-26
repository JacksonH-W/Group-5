import pytest
from pydantic import ValidationError
from app.auth.auth import UserRegister, UserLogin, UserResponse
from app.auth.security import hash_password, verify_password


@pytest.mark.unit
class TestPasswordHashing:
    def test_hash_password_returns_string(self):
        hashed = hash_password("securepass")
        assert isinstance(hashed, str)

    def test_hash_password_not_plaintext(self):
        password = "securepass"
        hashed = hash_password(password)
        assert hashed != password

    def test_verify_password_correct(self):
        password = "testpassword"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        hashed = hash_password("correctpassword")
        assert verify_password("wrongpassword", hashed) is False

    def test_verify_password_invalid_hash(self):
        assert verify_password("password", "not-a-valid-hash") is False


@pytest.mark.unit
class TestUserRegisterSchema:
    def test_valid_registration(self):
        user = UserRegister(
            username="testuser",
            email="test@example.com",
            password="password123",
        )
        assert user.username == "testuser"
        assert user.email == "test@example.com"

    def test_username_too_short(self):
        with pytest.raises(ValidationError):
            UserRegister(username="ab", email="t@example.com", password="password123")

    def test_username_too_long(self):
        with pytest.raises(ValidationError):
            UserRegister(
                username="a" * 51, email="t@example.com", password="password123"
            )

    def test_invalid_email(self):
        with pytest.raises(ValidationError):
            UserRegister(
                username="testuser", email="not-an-email", password="password123"
            )

    def test_password_too_short(self):
        with pytest.raises(ValidationError):
            UserRegister(
                username="testuser", email="t@example.com", password="short"
            )


@pytest.mark.unit
class TestUserLoginSchema:
    def test_valid_login(self):
        login = UserLogin(email="test@example.com", password="password123")
        assert login.email == "test@example.com"

    def test_invalid_email(self):
        with pytest.raises(ValidationError):
            UserLogin(email="bad-email", password="password123")
