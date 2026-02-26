class FakeResp:
    def __init__(self, data):
        self.data = data

    def __str__(self):
        return f"FakeResp(data={self.data})"


class FakeQuery:
    """
    Mimics the chain: table().select().limit().eq().execute()
    and records calls for assertions.
    """
    def __init__(self, data):
        self._data = data
        self.calls = []
        self.filters = []

    def select(self, what):
        self.calls.append(("select", what))
        return self

    def limit(self, n):
        self.calls.append(("limit", n))
        return self

    def eq(self, col, val):
        self.filters.append((col, val))
        self.calls.append(("eq", col, val))
        return self

    def execute(self):
        self.calls.append(("execute",))
        return FakeResp(self._data)


class FakeSupabase:
    def __init__(self, lessons_data):
        self._lessons_data = lessons_data
        self.last_query = None
        self.last_table = None

    def table(self, name):
        self.last_table = name
        self.last_query = FakeQuery(self._lessons_data)
        return self.last_query