import unittest
from urllib2 import Request, urlopen, URLError, HTTPError

class TestStringMethods(unittest.TestCase):

    def test_upper(self):
        req = Request('http://localhost:5000/')
        response = urlopen(req)
        print response
        self.assertEqual('foo'.upper(), 'FOO')

    def test_isupper(self):
        self.assertTrue('FOO'.isupper())
        self.assertFalse('Foo'.isupper())

    def test_split(self):
        s = 'hello world'
        self.assertEqual(s.split(), ['hello', 'world'])
        # check that s.split fails when the separator is not a string
        with self.assertRaises(TypeError):
            s.split(2)

if __name__ == '__main__':
    unittest.main()
