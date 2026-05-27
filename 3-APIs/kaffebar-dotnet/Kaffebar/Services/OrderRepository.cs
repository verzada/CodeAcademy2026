using Kaffebar.Models;
using System.Collections.Concurrent;

namespace Kaffebar.Services
{
    public class OrderRepository
    {
        // ConcurrentDictionary is thread-safe for multiple concurrent requests
        private readonly ConcurrentDictionary<Guid, Order> _orders = new();

        public Order? GetById(Guid id)
        {
            _orders.TryGetValue(id, out var order);
            return order;
        }

        public IEnumerable<Order> GetAll()
        {
            return _orders.Values;
        }

        public IEnumerable<Order> GetAll(OrderQuery query)
        {
            var result = _orders.Values.AsEnumerable();

            if (query.Status.HasValue)
            {
                result = result.Where(o => o.Status == query.Status.Value);
            }

            return result.Skip(query.Offset).Take(query.Limit);
        }

        public Order Add(Order order)
        {
            _orders.TryAdd(order.Id, order);
            return order;
        }

        public bool Update(Order order)
        {
            return _orders.TryUpdate(order.Id, order, _orders[order.Id]);
        }

        public bool Delete(Guid id)
        {
            return _orders.TryRemove(id, out _);
        }
    }
}
