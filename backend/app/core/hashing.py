import hashlib
import json
from typing import Any

def sha256_hash(data: Any) -> str:
    """
    Generate a SHA-256 hash for the given data.

    Args:
        data (Any): The input data to hash. It can be of any type that can be serialized to JSON.
    """

    return hashlib.sha256(data.encode("utf-8")).hexdigest() if isinstance(data, str) else hashlib.sha256(json.dumps(data, sort_keys=True).encode("utf-8")).hexdigest()


def hash_data(data: Any) -> str:
    serialized = json.dumps(
        data, 
        sort_keys=True,
        separators=(',', ':'),
    )

    return sha256_hash(serialized)

# print(sha256_hash("hello"))
# print(hash_data({"b": 2, "a": 1}))